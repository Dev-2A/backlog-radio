"use client";

import { useEffect } from "react";
import { usePlayer } from "./PlayerProvider";
import { formatDuration } from "@/lib/youtube";

export default function QueueDrawer({ open, onClose }) {
  const { queue, currentIndex, removeAt, clearQueue } = usePlayer();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[440px] bg-[var(--color-bg)] border-l border-[var(--color-border)] shadow-2xl flex flex-col animate-slide-in">
        {/* 헤더 */}
        <div className="flex-shrink-0 p-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--color-text-muted)] mb-1">
              📜 재생 큐
            </div>
            <div className="text-xl font-bold">
              {queue.length > 0 ? `${queue.length}곡` : "비어있음"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {queue.length > 0 && (
              <button
                onClick={clearQueue}
                className="px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-red-500/50 hover:text-red-400 transition-colors text-xs"
              >
                전체 삭제
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors flex items-center justify-center text-lg"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 목록 */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {queue.length === 0 ? (
            <div className="text-center py-16 text-[var(--color-text-muted)]">
              <div className="text-4xl mb-3 opacity-40">🎵</div>
              <div className="text-sm">
                큐가 비어있어요.
                <br />
                게임 OST를 선택하면 여기에 쌓여요.
              </div>
            </div>
          ) : (
            queue.map((item, i) => {
              const isCurrent = i === currentIndex;
              return (
                <div
                  key={`${item.videoId}-${i}`}
                  className={`group flex gap-3 p-2 rounded-lg border transition-colors ${
                    isCurrent
                      ? "bg-[var(--color-accent)]/10 border-[var(--color-accent)]"
                      : "bg-[var(--color-surface)] border-[var(--color-border)]"
                  }`}
                >
                  <div className="relative flex-shrink-0 w-24 aspect-video rounded overflow-hidden bg-[var(--color-bg)]">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl opacity-30">
                        🎵
                      </div>
                    )}
                    {isCurrent && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[var(--color-accent)] text-xl">
                        ♪
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm line-clamp-2 leading-snug mb-1">
                      {item.title}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] truncate">
                      {item.gameName ? `🎮 ${item.gameName}` : item.channel}
                    </div>
                    <div className="text-[10px] text-[var(--color-text-muted)] mt-1 font-mono">
                      {formatDuration(item.durationSeconds)}
                    </div>
                  </div>

                  <button
                    onClick={() => removeAt(i)}
                    className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                    aria-label="큐에서 제거"
                  >
                    ✕
                  </button>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
}
