"use client";

import { useEffect, useState } from "react";
import { usePlayer } from "./PlayerProvider";
import { formatDuration } from "@/lib/youtube";

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
  } = usePlayer();

  const [currentMeta, setCurrentMeta] = useState(null);

  // window에 박아둔 메타데이터 구독 (Step 8-7에서 설정)
  useEffect(() => {
    const onMetaChange = (e) => setCurrentMeta(e.detail);
    window.addEventListener("backlog-radio:meta", onMetaChange);
    return () => window.removeEventListener("backlog-radio:meta", onMetaChange);
  }, []);

  // 재생 중인 영상이 없으면 플레이어 바를 숨김
  if (!currentVideoId) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    seek(duration * ratio);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-[var(--color-surface)] border-t border-[var(--color-border)] backdrop-blur-md">
      {/* 진행 바 (클릭해서 seek) */}
      <div
        className="h-1 bg-[var(--color-bg)] cursor-pointer group"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-[var(--color-accent)] transition-all group-hover:h-1.5"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 sm:gap-4">
        {/* 썸네일 + 타이틀 */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {currentMeta?.thumbnail && (
            <img
              src={currentMeta.thumbnail}
              alt=""
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm truncate">
              {currentMeta?.title ?? "재생 중…"}
            </div>
            <div className="text-xs text-[var(--color-text-muted)] truncate">
              {currentMeta?.gameName
                ? `🎮 ${currentMeta.gameName} · ${currentMeta.channel ?? ""}`
                : (currentMeta?.channel ?? "")}
            </div>
          </div>
        </div>

        {/* 시간 표시 (데스크톱만) */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-mono">
          <span>{formatDuration(Math.floor(currentTime))}</span>
          <span>/</span>
          <span>{formatDuration(Math.floor(duration))}</span>
        </div>

        {/* 재생 컨트롤 */}
        <button
          onClick={togglePlay}
          disabled={!!error}
          className="flex-shrink-0 w-11 h-11 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] flex items-center justify-center text-lg font-bold hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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

        {/* 볼륨 (데스크톱만) */}
        <div className="hidden md:flex items-center gap-2">
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
            className="w-24 accent-[var(--color-accent)]"
            aria-label="볼륨"
          />
        </div>
      </div>

      {/* 에러 바 */}
      {error && (
        <div className="px-4 py-2 bg-red-500/10 text-red-400 text-xs text-center border-t border-red-500/30">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
