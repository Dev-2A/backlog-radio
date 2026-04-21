"use client";

import { formatDuration } from "@/lib/youtube";
import { formatCompactNumber, formatRelativeTime } from "@/lib/format";

export default function OstResultCard({ video, rank, onPlay }) {
  const isTop = rank === 1;

  return (
    <button
      onClick={() => onPlay(video)}
      className={`group w-full text-left p-3 rounded-xl border transition-all ${
        isTop
          ? "bg-[var(--color-accent)]/10 border-[var(--color-accent)]"
          : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-accent)]"
      }`}
    >
      <div className="flex gap-3">
        {/* 썸네일 */}
        <div className="relative flex-shrink-0 w-32 aspect-video rounded-lg overflow-hidden bg-[var(--color-bg)]">
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">
              🎵
            </div>
          )}
          {/* 재생시간 배지 */}
          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono">
            {formatDuration(video.durationSeconds)}
          </div>
          {/* 호버 시 ▶ 오버레이 */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-bg)] text-lg">
              ▶
            </div>
          </div>
        </div>

        {/* 메타데이터 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            {isTop && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[var(--color-accent)] text-[var(--color-bg)] text-[10px] font-bold">
                ⭐ 최적
              </span>
            )}
            <div className="font-medium text-sm line-clamp-2 leading-snug">
              {video.title}
            </div>
          </div>
          <div className="text-xs text-[var(--color-text-muted)] truncate mb-1">
            {video.channel}
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-2">
            <span>👁 {formatCompactNumber(video.viewCount)}</span>
            <span>·</span>
            <span>{formatRelativeTime(video.publishedAt)}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
