const STEAM_API_BASE = "https://api.steampowered.com";

/**
 * 커스텀 URL 또는 SteamID64를 SteamID64로 정규화
 * @param {string} input — '76561198...' 또는 'tangi826' 또는 프로필 URL
 * @returns {Promise<string|null>} — SteamID64 또는 null
 */
export async function resolveSteamId(input) {
  const trimmed = input.trim();

  // URL에서 ID 추출
  const urlMatch = trimmed.match(
    /steamcommunity\.com\/(?:profiles|id)\/([^/?]+)/,
  );
  const candidate = urlMatch ? urlMatch[1] : trimmed;

  // 이미 SteamID64 형식(17자리 숫자)이면 그대로 반환
  if (/^\d{17}$/.test(candidate)) {
    return candidate;
  }

  // 커스텀 URL → SteamID64 변환
  const key = process.env.STEAM_API_KEY;
  const url = `${STEAM_API_BASE}/ISteamUser/ResolveVanityURL/v1/?key=${key}&vanityurl=${encodeURIComponent(candidate)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.response?.success === 1 ? data.response.steamid : null;
  } catch {
    return null;
  }
}

/**
 * SteamID64로 프로필 정보 조회
 * @param {string} steamId — 17자리 SteamID64
 * @returns {Promise<object|null>}
 */
export async function getPlayerSummary(steamId) {
  const key = process.env.STEAM_API_KEY;
  const url = `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v2/?key=${key}&steamids=${steamId}`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    const player = data?.response?.players?.[0];
    if (!player) return null;

    return {
      steamId: player.steamid,
      name: player.personaname,
      avatar: player.avatarfull,
      profileUrl: player.profileurl,
      isPublic: player.communityvisibilitystate === 3, // 3 = public
      lastLogoff: player.lastlogoff,
      realName: player.realname ?? null,
      country: player.loccountrycode ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * SteamID64로 소유 게임 목록 조회
 * @param {string} steamId — 17자리 SteamID64
 * @returns {Promise<Array<object>|null>}
 */
export async function getOwnedGames(steamId) {
  const key = process.env.STEAM_API_KEY;
  const url = `${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v1/?key=${key}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true&format=json`;

  try {
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const games = data?.response?.games;
    if (!Array.isArray(games)) return null;

    // 정규화
    return games.map((g) => ({
      appId: g.appid,
      name: g.name,
      iconHash: g.img_icon_url,
      playtimeMinutes: g.playtime_forever ?? 0,
      playtimeRecentMinutes: g.playtime_2weeks ?? 0,
      // Steam CDN 아이콘 URL
      iconUrl: g.img_icon_url
        ? `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`
        : null,
      // Steam Store 헤더 이미지 (가로 긴 배너)
      headerUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appid}/header.jpg`,
      // Steam Store 라이브러리 카드 이미지 (세로)
      libraryUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appid}/library_600x900.jpg`,
    }));
  } catch {
    return null;
  }
}

/**
 * 백로그 카테고리 분류
 * @param {number} minutes — 총 플레이타임 (분)
 * @returns {'untouched'|'barely'|'lightly'|'played'}
 */
export function getBacklogCategory(minutes) {
  if (minutes === 0) return "untouched";
  if (minutes <= 60) return "barely";
  if (minutes <= 180) return "lightly";
  return "played";
}

/**
 * 백로그 카테고리 메타데이터
 */
export const BACKLOG_CATEGORIES = {
  untouched: {
    key: "untouched",
    emoji: "🌱",
    label: "완전 백로그",
    desc: "한 번도 안 켜본 게임",
    color: "emerald",
  },
  barely: {
    key: "barely",
    emoji: "🌿",
    label: "거의 백로그",
    desc: "1시간 이내 플레이",
    color: "lime",
  },
  lightly: {
    key: "lightly",
    emoji: "🌳",
    label: "가볍게 해본",
    desc: "1~3시간 플레이",
    color: "cyan",
  },
  played: {
    key: "played",
    emoji: "🏔️",
    label: "진행 중/완료",
    desc: "3시간 이상 플레이",
    color: "slate",
  },
};

/**
 * 게임 목록을 백로그 카테고리별로 그룹화 + 통계
 */
export function groupByBacklog(games) {
  const groups = {
    untouched: [],
    barely: [],
    lightly: [],
    played: [],
  };

  for (const game of games) {
    const category = getBacklogCategory(game.playtimeMinutes);
    groups[category].push(game);
  }

  // 각 그룹 내부는 이름 오름차순 정렬
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }

  return {
    groups,
    stats: {
      total: games.length,
      untouched: groups.untouched.length,
      barely: groups.barely.length,
      lightly: groups.lightly.length,
      played: groups.played.length,
      backlogTotal:
        groups.untouched.length + groups.barely.length + groups.lightly.length,
      totalPlaytimeHours: Math.round(
        games.reduce((sum, g) => sum + g.playtimeMinutes, 0) / 60,
      ),
    },
  };
}
