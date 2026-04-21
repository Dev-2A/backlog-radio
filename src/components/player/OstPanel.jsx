"use client";

import { useEffect } from "react";
import OstResultCard from "./OstResultCard";
import Spinner from "@/components/ui/Spinner";
import useOstSearch from "@/hooks/useOstSearch";

export default function OstPanel({ game, onClose, onPlay, onEnqueueAll }) {
  const { videos, loading, error } = useOstSearch(game);

  useEffect(() => {
    if (!game) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [game, onClose]);

  useEffect(() => {
    if (!game) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [game]);

  if (!game) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[480px] bg-[var(--color-bg)] border-l border-[var(--color-border)] shadow-2xl flex flex-col animate-slide-in">
        <div className="flex-shrink-0 p-5 border-b border-[var(--color-border)]">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[var(--color-text-muted)] mb-1">
                🎵 OST 검색 결과
              </div>
              <div className="text-xl font-bold truncate">{game.name}</div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-9 h-9 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors flex items-center justify-center text-lg"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          {videos && videos.length > 0 && (
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-[var(--color-text-muted)]">
                {videos.length}개의 후보 · 점수 높은 순
              </div>
              <button
                onClick={() => onEnqueueAll(videos, game)}
                className="px-3 py-1.5 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[var(--color-accent)] text-xs font-medium hover:bg-[var(--color-accent)]/20 transition-colors"
              >
                + 전체 큐에 추가
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {loading && <Spinner label="OST를 찾는 중…" />}

          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          {videos && videos.length === 0 && (
            <div className="text-center py-12 text-[var(--color-text-muted)]">
              <div className="text-4xl mb-3 opacity-40">🔍</div>
              <div className="text-sm">
                OST 후보를 찾지 못했어요.
                <br />
                아직 사운드트랙이 공개되지 않았을지도 몰라요.
              </div>
            </div>
          )}

          {videos?.map((video, i) => (
            <OstResultCard
              key={video.videoId}
              video={video}
              rank={i + 1}
              onPlay={(v) => onPlay(v, videos, i)}
            />
          ))}
        </div>

        <div className="flex-shrink-0 p-4 border-t border-[var(--color-border)] text-[10px] text-[var(--color-text-muted)] text-center">
          YouTube Data API · 저작권은 각 업로더에 귀속
        </div>
      </aside>
    </>
  );
}
