/**
 * ISO 8601 주차 계산 — 월요일 시작, 같은 주는 같은 숫자를 반환
 * 예: "2026-W17"
 */
export function getIsoWeekKey(date = new Date()) {
  const d = new Date(date);
  // UTC 기준으로 정규화
  d.setUTCHours(0, 0, 0, 0);
  // 목요일 기준 주차 계산 (ISO 8601 표준)
  const dayNum = d.getUTCDay() || 7; // 일=0을 7로
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

/**
 * 이번 주 월요일 자정의 Date 객체
 */
export function getWeekStart(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return d;
}

/**
 * 다음 주 월요일까지 남은 시간 ("3일 4시간 뒤 갱신")
 */
export function formatTimeUntilNextWeek(date = new Date()) {
  const next = getWeekStart(date);
  next.setDate(next.getDate() + 7);
  const diffMs = next - date;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}일 ${hours}시간 뒤 갱신`;
  if (hours > 0) return `${hours}시간 뒤 갱신`;
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${minutes}분 뒤 갱신`;
}

/**
 * 문자열을 32-bit 정수 해시로 (cyrb53 경량 버전)
 * 시드 생성용 — 암호학적 안전성은 필요 없음
 */
function hashString(str) {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

/**
 * 시드 기반 난수 생성기 (mulberry32) — 같은 시드는 항상 같은 수열 반환
 */
function createRng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 시드 기반 Fisher-Yates 셔플
 */
function seededShuffle(array, seed) {
  const rng = createRng(seed);
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 백로그 게임 중 이번 주 추천 N개를 결정론적으로 뽑기
 *
 * @param {Array} games — 백로그 게임 목록 (untouched + barely + lightly)
 * @param {string} userId — Steam ID
 * @param {number} count — 뽑을 개수 (기본 3)
 * @param {Date} now — 기준 시각 (테스트용)
 */
export function pickWeeklyBacklog(games, userId, count = 3, now = new Date()) {
  if (!Array.isArray(games) || games.length === 0) return [];

  const weekKey = getIsoWeekKey(now);
  const seed = hashString(`${userId}:${weekKey}`);
  const shuffled = seededShuffle(games, seed);

  return shuffled.slice(0, Math.min(count, shuffled.length));
}
