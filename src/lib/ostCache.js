import { getItem, setItem } from "./storage";

const CACHE_KEY = "backlog-radio:ost-cache:v1";
const TTL_DAYS = 30;

/**
 * 캐시 구조:
 * {
 *   [gameName.toLowerCase()]: {
 *     cachedAt: timestamp (ms),
 *     videos: Array<VideoObject>
 *   }
 * }
 */

function normalizeKey(gameName) {
  return gameName.trim().toLowerCase();
}

export function getCachedOst(gameName) {
  const cache = getItem(CACHE_KEY, {});
  const entry = cache[normalizeKey(gameName)];
  if (!entry) return null;

  // TTL 체크
  const ageMs = Date.now() - entry.cachedAt;
  const ttlMs = TTL_DAYS * 24 * 60 * 60 * 1000;
  if (ageMs > ttlMs) return null;

  return entry.videos;
}

export function setCachedOst(gameName, videos) {
  const cache = getItem(CACHE_KEY, {});
  cache[normalizeKey(gameName)] = {
    cachedAt: Date.now(),
    videos,
  };

  // 🪄 용량 관리: 100개 넘어가면 오래된 것부터 제거
  const entries = Object.entries(cache);
  if (entries.length > 100) {
    entries.sort((a, b) => b[1].cachedAt - a[1].cachedAt);
    const trimmed = Object.fromEntries(entries.slice(0, 80));
    return setItem(CACHE_KEY, trimmed);
  }

  return setItem(CACHE_KEY, cache);
}

export function getCacheStats() {
  const cache = getItem(CACHE_KEY, {});
  const entries = Object.values(cache);
  if (entries.length === 0) return { count: 0, oldestDate: null };

  const oldestMs = Math.min(...entries.map((e) => e.cachedAt));
  return {
    count: entries.length,
    oldestDate: new Date(oldestMs),
  };
}

export function clearOstCache() {
  setItem(CACHE_KEY, {});
}
