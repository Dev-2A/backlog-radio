"use client";

import { useEffect, useState } from "react";
import { usePlayer } from "./PlayerProvider";
import { formatDuration } from "@/lib/youtube";
import QueueDrawer from "./QueueDrawer";

export default function MiniPlayer() {
  const {
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    volume,
    muted,
    currentVideoId,
    error,
    togglePlay,
    seek,
    changeVolume,
    toggleMute,
    playNext,
    playPrev,
    hasNext,
    hasPrev,
    shuffle,
    setShuffle,
    repeat,
    setRepeat,
    queue,
    currentIndex,
  } = usePlayer();

  const [currentMeta, setCurrentMeta] = useState(null);
  const [queueOpen, setQueueOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onMetaChange = (e) => setCurrentMeta(e.detail);
    window.addEventListener("backlog-radio:meta", onMetaChange);
    return () => window.removeEventListener("backlog-radio:meta", onMetaChange);
  }, []);

  if (!currentVideoId) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    seek(duration * ratio);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[var(--color-surface)]/95 border-t border-[var(--color-border)] backdrop-blur-md">
        {/* 진행 바 */}
        <div
          className="h-1 bg-[var(--color-bg)] cursor-pointer group"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-[var(--color-accent)] transition-all group-hover:h-1.5"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3">
          {/* 썸네일 + 타이틀 */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {currentMeta?.thumbnail && (
              <img
                src={currentMeta.thumbnail}
                alt=""
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="font-medium text-xs sm:text-sm truncate leading-tight">
                {currentMeta?.title ?? "재생 중…"}
              </div>
              <div className="text-[10px] sm:text-xs text-[var(--color-text-muted)] truncate mt-0.5">
                {currentMeta?.gameName
                  ? `🎮 ${currentMeta.gameName}`
                  : (currentMeta?.channel ?? "")}
                {queue.length > 1 && (
                  <span className="ml-1.5 opacity-70">
                    · {currentIndex + 1}/{queue.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 시간 (데스크톱 대형만) */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-mono">
            <span>{formatDuration(Math.floor(currentTime))}</span>
            <span>/</span>
            <span>{formatDuration(Math.floor(duration))}</span>
          </div>

          {/* 재생 컨트롤 */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              onClick={playPrev}
              disabled={!hasPrev}
              className="hidden sm:flex w-9 h-9 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors items-center justify-center text-base disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="이전"
            >
              ⏮
            </button>
            <button
              onClick={togglePlay}
              disabled={!!error}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] flex items-center justify-center text-base sm:text-lg font-bold hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={isPlaying ? "일시정지" : "재생"}
            >
              {isBuffering ? (
                <span className="animate-pulse">…</span>
              ) : isPlaying ? (
                "⏸"
              ) : (
                "▶"
              )}
            </button>
            <button
              onClick={playNext}
              disabled={!hasNext}
              className="w-9 h-9 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors flex items-center justify-center text-base disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="다음"
            >
              ⏭
            </button>
          </div>

          {/* 셔플/반복 (태블릿 이상) */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={`w-8 h-8 rounded-lg transition-colors flex items-center justify-center text-sm ${
                shuffle
                  ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"
              }`}
              aria-label="셔플"
              title="셔플"
            >
              🔀
            </button>
            <button
              onClick={() => setRepeat(!repeat)}
              className={`w-8 h-8 rounded-lg transition-colors flex items-center justify-center text-sm ${
                repeat
                  ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"
              }`}
              aria-label="반복"
              title="반복"
            >
              🔁
            </button>
          </div>

          {/* 볼륨 (데스크톱만) */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={toggleMute}
              className="w-8 h-8 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors flex items-center justify-center"
              aria-label={muted ? "음소거 해제" : "음소거"}
            >
              {muted || volume === 0 ? "🔇" : volume < 50 ? "🔉" : "🔊"}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={muted ? 0 : volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              className="w-16 lg:w-20 accent-[var(--color-accent)]"
              aria-label="볼륨"
            />
          </div>

          {/* 모바일용 "더보기" 토글 */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className={`md:hidden w-9 h-9 rounded-lg bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] transition-colors flex items-center justify-center text-sm ${
              expanded ? "text-[var(--color-accent)]" : ""
            }`}
            aria-label="더보기"
          >
            ⋯
          </button>

          {/* 큐 */}
          <button
            onClick={() => setQueueOpen(true)}
            className="w-9 h-9 rounded-lg bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] transition-colors flex items-center justify-center text-sm relative"
            aria-label="큐 열기"
            title="재생 큐"
          >
            📜
            {queue.length > 1 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] text-[10px] font-bold flex items-center justify-center">
                {queue.length}
              </span>
            )}
          </button>
        </div>

        {/* 모바일 확장 영역 */}
        {expanded && (
          <div className="md:hidden px-3 pb-3 flex items-center gap-2 border-t border-[var(--color-border)] pt-2">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={`flex-1 h-9 rounded-lg transition-colors flex items-center justify-center gap-1 text-xs ${
                shuffle
                  ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                  : "bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
              }`}
            >
              🔀 셔플
            </button>
            <button
              onClick={() => setRepeat(!repeat)}
              className={`flex-1 h-9 rounded-lg transition-colors flex items-center justify-center gap-1 text-xs ${
                repeat
                  ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                  : "bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
              }`}
            >
              🔁 반복
            </button>
            <button
              onClick={toggleMute}
              className="w-9 h-9 rounded-lg bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] transition-colors flex items-center justify-center"
            >
              {muted || volume === 0 ? "🔇" : volume < 50 ? "🔉" : "🔊"}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={muted ? 0 : volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              className="flex-1 accent-[var(--color-accent)]"
              aria-label="볼륨"
            />
          </div>
        )}

        {error && (
          <div className="px-4 py-2 bg-red-500/10 text-red-400 text-xs text-center border-t border-red-500/30">
            ⚠️ {error}
            {hasNext && (
              <button
                onClick={playNext}
                className="ml-2 underline hover:text-red-300"
              >
                다음 곡으로 넘어가기
              </button>
            )}
          </div>
        )}
      </div>

      <QueueDrawer open={queueOpen} onClose={() => setQueueOpen(false)} />
    </>
  );
}
