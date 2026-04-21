"use client";

import { useEffect } from "react";
import { usePlayer } from "@/components/player/PlayerProvider";

/**
 * 전역 키보드 단축키:
 * - Space: 재생/일시정지
 * - →: 10초 앞으로
 * - ←: 10초 뒤로
 * - Shift + →: 다음 곡
 * - Shift + ←: 이전 곡
 * - M: 음소거 토글
 */
export default function useKeyboardShortcuts() {
  const {
    currentVideoId,
    togglePlay,
    seek,
    currentTime,
    duration,
    playNext,
    playPrev,
    toggleMute,
  } = usePlayer();

  useEffect(() => {
    if (!currentVideoId) return;

    const isTypingTarget = (el) => {
      if (!el) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
      );
    };

    const onKey = (e) => {
      if (isTypingTarget(document.activeElement)) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          e.preventDefault();
          if (e.shiftKey) {
            playNext();
          } else {
            seek(Math.min(duration, currentTime + 10));
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (e.shiftKey) {
            playPrev();
          } else {
            seek(Math.max(0, currentTime - 10));
          }
          break;
        case "m":
        case "M":
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    currentVideoId,
    togglePlay,
    seek,
    currentTime,
    duration,
    playNext,
    playPrev,
    toggleMute,
  ]);
}
