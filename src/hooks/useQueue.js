"use client";

import { useCallback, useState } from "react";

/**
 * 재생 큐 관리 훅.
 *
 * 큐 아이템 구조:
 * {
 *   videoId, title, channel, thumbnail, durationSeconds,
 *   gameName, appId  ← 메타데이터
 * }
 */
export default function useQueue() {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const currentItem = currentIndex >= 0 ? (queue[currentIndex] ?? null) : null;

  /** 큐를 완전히 새로 덮어쓰고 지정한 인덱스로 재생 시작 */
  const replaceQueue = useCallback((items, startIndex = 0) => {
    setQueue(items);
    setCurrentIndex(items.length > 0 ? startIndex : -1);
  }, []);

  /** 큐 끝에 항목들 추가 (중복 제외) */
  const enqueue = useCallback((items) => {
    setQueue((prev) => {
      const existing = new Set(prev.map((i) => i.videoId));
      const fresh = items.filter((i) => !existing.has(i.videoId));
      return [...prev, ...fresh];
    });
  }, []);

  /** 특정 videoId를 큐에서 찾아 거기로 점프, 없으면 큐 앞에 삽입 */
  const jumpTo = useCallback((videoId) => {
    setQueue((prev) => {
      const idx = prev.findIndex((i) => i.videoId === videoId);
      if (idx >= 0) {
        setCurrentIndex(idx);
        return prev;
      }
      return prev;
    });
  }, []);

  /** 다음 인덱스 계산 (셔플/반복 고려) */
  const getNextIndex = useCallback(() => {
    if (queue.length === 0) return -1;

    if (shuffle) {
      if (queue.length === 1) return repeat ? 0 : -1;
      // 현재 곡 제외한 랜덤 인덱스
      let next;
      do {
        next = Math.floor(Math.random() * queue.length);
      } while (next === currentIndex);
      return next;
    }

    const next = currentIndex + 1;
    if (next >= queue.length) return repeat ? 0 : -1;
    return next;
  }, [queue.length, currentIndex, shuffle, repeat]);

  const getPrevIndex = useCallback(() => {
    if (queue.length === 0) return -1;
    if (shuffle) return getNextIndex(); // 셔플 모드에서 이전은 사실상 랜덤
    const prev = currentIndex - 1;
    if (prev < 0) return repeat ? queue.length - 1 : -1;
    return prev;
  }, [queue.length, currentIndex, shuffle, repeat, getNextIndex]);

  const next = useCallback(() => {
    const idx = getNextIndex();
    if (idx >= 0) setCurrentIndex(idx);
    return idx;
  }, [getNextIndex]);

  const prev = useCallback(() => {
    const idx = getPrevIndex();
    if (idx >= 0) setCurrentIndex(idx);
    return idx;
  }, [getPrevIndex]);

  const removeAt = useCallback(
    (index) => {
      setQueue((prev) => prev.filter((_, i) => i !== index));
      setCurrentIndex((ci) => {
        if (index < ci) return ci - 1;
        if (index === ci) return ci < queue.length - 1 ? ci : -1;
        return ci;
      });
    },
    [queue.length],
  );

  const clear = useCallback(() => {
    setQueue([]);
    setCurrentIndex(-1);
  }, []);

  const hasNext = getNextIndex() >= 0;
  const hasPrev = getPrevIndex() >= 0;

  return {
    queue,
    currentIndex,
    currentItem,
    shuffle,
    repeat,
    hasNext,
    hasPrev,
    replaceQueue,
    enqueue,
    jumpTo,
    next,
    prev,
    removeAt,
    clear,
    setShuffle,
    setRepeat,
  };
}
