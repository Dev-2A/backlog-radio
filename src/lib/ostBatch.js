/**
 * 여러 게임의 OST 검색을 병렬로 수행.
 * 각 게임당 "점수 1위 영상"만 추려서 반환.
 *
 * @param {Array} games — appId, name 포함 객체 배열
 * @returns {Promise<Array>} — { game, video } 형태의 배열 (OST를 못 찾은 게임은 제외)
 */
export async function fetchTopOstPerGame(games) {
  const tasks = games.map(async (game) => {
    try {
      const res = await fetch(
        `/api/youtube/ost?game=${encodeURIComponent(game.name)}`,
      );
      if (!res.ok) return null;
      const data = await res.json();
      const top = data.videos?.[0];
      if (!top) return null;
      return { game, video: top };
    } catch {
      return null;
    }
  });

  const results = await Promise.all(tasks);
  return results.filter(Boolean);
}
