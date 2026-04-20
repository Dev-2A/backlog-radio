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
