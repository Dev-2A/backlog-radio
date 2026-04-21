/**
 * SSR 안전 localStorage 래퍼.
 * 서버 환경이나 용량 초과 등 예외 상황에서도 터지지 않게 처리.
 */

const isClient = () => typeof window !== "undefined";

export function getItem(key, fallback = null) {
  if (!isClient()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setItem(key, value) {
  if (!isClient()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // 용량 초과 등 에러 시 조용히 실패
    return false;
  }
}

export function removeItem(key) {
  if (!isClient()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // noop
  }
}

/**
 * localStorage 키가 바뀌었을 때 알림 받기 (다른 탭 동기화)
 */
export function subscribe(key, callback) {
  if (!isClient()) return () => {};

  const handler = (e) => {
    if (e.key === key) {
      try {
        callback(e.newValue ? JSON.parse(e.newValue) : null);
      } catch {
        callback(null);
      }
    }
  };

  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}
