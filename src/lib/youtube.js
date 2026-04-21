const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

/**
 * OST 검색 쿼리 빌더 — 게임 이름 → 효과적인 검색어
 * 여러 후보를 시도해서 가장 좋은 결과를 고를 수 있도록 설계
 */
export function buildOstQueries(gameName) {
  const base = gameName.trim();
  // 괄호/부제 등 노이즈 제거 (예: "Game Name: Subtitle" → "Game Name")
  const simplified = base
    .replace(/[:\-–—].+$/, "")
    .replace(/\s*\([^)]*\)/g, "")
    .trim();

  const queries = [
    // 1차: 전체 OST/사운드트랙 플레이리스트 (가장 가치 높음)
    `${base} full soundtrack`,
    `${base} OST full album`,
    // 2차: 메인 테마
    `${base} main theme`,
    // 3차: 단순 OST
    `${base} OST`,
  ];

  // 간소화된 이름이 원본과 다르면 추가 시도
  if (simplified !== base && simplified.length > 2) {
    queries.push(`${simplified} soundtrack`);
  }

  return queries;
}

/**
 * YouTube 영상 썸네일 URL — 가장 고해상도 우선 선택
 */
function pickThumbnail(thumbnails) {
  if (!thumbnails) return null;
  return (
    thumbnails.maxres?.url ??
    thumbnails.high?.url ??
    thumbnails.medium?.url ??
    thumbnails.default?.url ??
    null
  );
}

/**
 * ISO 8601 재생시간 → 초 단위
 * 예: "PT1H2M30S" → 3750
 */
export function parseDuration(iso) {
  if (!iso) return 0;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const [, h, m, s] = match;
  return (
    (parseInt(h) || 0) * 3600 + (parseInt(m) || 0) * 60 + (parseInt(s) || 0)
  );
}

/**
 * 초 → "1:02:30" 형식 문자열
 */
export function formatDuration(seconds) {
  if (!seconds) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * YouTube 검색 — search.list
 * @returns {Promise<Array>} videoId 배열
 */
async function searchVideos(query, maxResults = 10) {
  const key = process.env.YOUTUBE_API_KEY;
  const params = new URLSearchParams({
    key,
    q: query,
    part: "snippet",
    type: "video",
    videoEmbeddable: "true", // 임베디 가능한 영상만 (중요!)
    maxResults: String(maxResults),
    relevanceLanguage: "en",
    safeSearch: "none",
  });

  const url = `${YOUTUBE_API_BASE}/search?${params}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube search 실패: ${res.status} ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  return (data.items ?? []).map((item) => item.id.videoId).filter(Boolean);
}

/**
 * 영상 상세 정보 조회 — videos.list
 * duration, viewCount 같은 정보는 search.list 응답에 없어서 추가 호출 필요
 */
async function getVideoDetails(videoIds) {
  if (videoIds.length === 0) return [];

  const key = process.env.YOUTUBE_API_KEY;
  const params = new URLSearchParams({
    key,
    id: videoIds.join(","),
    part: "snippet,contentDetails,statistics,status",
    maxResults: String(videoIds.length),
  });

  const url = `${YOUTUBE_API_BASE}/videos?${params}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube videos 실패: ${res.status} ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  return (data.items ?? []).map((v) => ({
    videoId: v.id,
    title: v.snippet.title,
    channel: v.snippet.channelTitle,
    channelId: v.snippet.channelId,
    publishedAt: v.snippet.publishedAt,
    thumbnail: pickThumbnail(v.snippet.thumbnails),
    durationSeconds: parseDuration(v.contentDetails?.duration),
    viewCount: Number(v.statistics?.viewCount ?? 0),
    embeddable: v.status?.embeddable !== false,
  }));
}

/**
 * OST 후보 영상에 점수 매기기 — 좋은 OST일수록 높은 점수
 */
function scoreOstCandidate(video, gameName) {
  let score = 0;
  const title = video.title.toLowerCase();
  const channel = video.channel.toLowerCase();
  const game = gameName.toLowerCase();

  // 게임 이름이 제목에 포함
  if (title.includes(game)) score += 50;

  // OST/soundtrack/full album 등 키워드
  if (/full\s*(soundtrack|ost|album)/.test(title)) score += 40;
  if (/\bost\b/.test(title) || /soundtrack/.test(title)) score += 20;
  if (/full\s*album/.test(title)) score += 25;
  if (/main\s*theme/.test(title)) score += 15;
  if (/playlist|compilation/.test(title)) score += 10;

  // 재생시간 보너스 (긴 영상 = OST 전곡일 가능성 높음)
  if (video.durationSeconds >= 1800)
    score += 30; // 30분 이상
  else if (video.durationSeconds >= 600)
    score += 15; // 10분 이상
  else if (video.durationSeconds < 60) score -= 20; // 1분 미만은 티저일 가능성

  // 조회수 가중치 (로그 스케일)
  if (video.viewCount > 0) {
    score += Math.min(30, Math.log10(video.viewCount) * 5);
  }

  // 게임 제작사 채널로 보이면 보너스
  if (channel.includes("official") || channel.includes("music")) score += 10;

  // 리액션/리뷰는 감점
  if (/reaction|review|gameplay|walkthrough|playthrough/.test(title))
    score -= 30;
  // 커버/리믹스는 소폭 감점 (원곡 우선)
  if (/cover|remix|piano version|guitar version/.test(title)) score -= 10;

  return score;
}

/**
 * 게임 이름으로 OST 검색 (메인 진입점)
 */
export async function searchGameOst(gameName) {
  const queries = buildOstQueries(gameName);

  // 첫 쿼리만 사용 (할당량 절약). 결과가 너무 적으면 2차 쿼리 시도.
  let videoIds = await searchVideos(queries[0], 10);

  if (videoIds.length < 3 && queries.length > 1) {
    const extra = await searchVideos(queries[1], 10);
    videoIds = [...new Set([...videoIds, ...extra])];
  }

  if (videoIds.length === 0) return [];

  const details = await getVideoDetails(videoIds);

  // 임베드 불가 영상 제거
  const embeddable = details.filter((v) => v.embeddable);

  // 점수 계산 후 정렬
  const scored = embeddable.map((v) => ({
    ...v,
    score: scoreOstCandidate(v, gameName),
  }));
  scored.sort((a, b) => b.score - a.score);

  return scored;
}
