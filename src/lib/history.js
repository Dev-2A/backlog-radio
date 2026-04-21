import { getItem, setItem } from "./storage";

const HISTORY_KEY = "backlog-radio:history:v1";
const MAX_ENTRIES = 500;

/**
 * 히스토리 엔트리 구조:
 * {
 *   videoId, title, channel, thumbnail, durationSeconds,
 *   gameName, appId, playedAt (timestamp ms)
 * }
 *
 * 같은 영상을 여러 번 들어도 매번 새 엔트리로 쌓임 (재생 기록 본연의 의미).
 */

export function getHistory() {
  return getItem(HISTORY_KEY, []);
}

export function addHistoryEntry(entry) {
  const history = getHistory();
  const next = [{ ...entry, playedAt: Date.now() }, ...history].slice(
    0,
    MAX_ENTRIES,
  );
  setItem(HISTORY_KEY, next);
}

export function clearHistory() {
  setItem(HISTORY_KEY, []);
}

/**
 * 히스토리 요약 통계.
 */
export function getHistoryStats() {
  const history = getHistory();
  if (history.length === 0) {
    return {
      total: 0,
      uniqueVideos: 0,
      uniqueGames: 0,
      topGames: [],
      topVideos: [],
      totalPlayMinutes: 0,
    };
  }

  // 게임별 재생 횟수
  const gameCount = new Map();
  // 영상별 재생 횟수
  const videoCount = new Map();
  let totalSeconds = 0;

  for (const entry of history) {
    totalSeconds += entry.durationSeconds || 0;

    if (entry.gameName) {
      gameCount.set(entry.gameName, (gameCount.get(entry.gameName) || 0) + 1);
    }

    const vKey = entry.videoId;
    if (!videoCount.has(vKey)) {
      videoCount.set(vKey, { ...entry, count: 0 });
    }
    videoCount.get(vKey).count += 1;
  }

  const topGames = [...gameCount.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topVideos = [...videoCount.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    total: history.length,
    uniqueVideos: videoCount.size,
    uniqueGames: gameCount.size,
    topGames,
    topVideos,
    totalPlayMinutes: Math.round(totalSeconds / 60),
  };
}
