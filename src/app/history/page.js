"use client";

import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import { usePlayer } from "@/components/player/PlayerProvider";
import { getHistory, clearHistory } from "@/lib/history";
import { formatDuration } from "@/lib/youtube";
import { formatRelativeTime } from "@/lib/format";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [mounted, setMounted] = useState(false);
  const { playVideos, addToQueue } = usePlayer();

  useEffect(() => {
    setMounted(true);
    setHistory(getHistory());

    const onUpdate = () => setHistory(getHistory());
    window.addEventListener("backlog-radio:history-updated", onUpdate);
    return () =>
      window.removeEventListener("backlog-radio:history-updated", onUpdate);
  }, []);

  if (!mounted) {
    return (
      <Container className="py-12">
        <div className="h-96" />
      </Container>
    );
  }

  const handlePlayAgain = (entry) => {
    // 히스토리 엔트리 하나를 큐로 변환해 재생
    const item = {
      videoId: entry.videoId,
      title: entry.title,
      channel: entry.channel,
      thumbnail: entry.thumbnail,
      durationSeconds: entry.durationSeconds,
      gameName: entry.gameName,
      appId: entry.appId,
    };
    playVideos([item], 0);
  };

  const handleAddToQueue = (entry) => {
    addToQueue([
      {
        videoId: entry.videoId,
        title: entry.title,
        channel: entry.channel,
        thumbnail: entry.thumbnail,
        durationSeconds: entry.durationSeconds,
        gameName: entry.gameName,
        appId: entry.appId,
      },
    ]);
  };

  const handleClear = () => {
    if (
      !confirm(
        "재생 히스토리를 전부 삭제할까요?\n\n⚠️ 통계 페이지의 누적 데이터도 함께 초기화됩니다.",
      )
    )
      return;
    clearHistory();
    setHistory([]);
  };

  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">📜 재생 히스토리</h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              최근 {history.length}개의 재생 기록 · 최대 500개까지 저장
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-red-500/50 hover:text-red-400 transition-colors text-sm"
            >
              전체 삭제
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-text-muted)]">
            <div className="text-6xl mb-4 opacity-40">🎵</div>
            <div className="text-lg mb-2">아직 들은 OST가 없어요</div>
            <div className="text-sm">
              <a
                href="/"
                className="text-[var(--color-accent)] hover:underline"
              >
                메인으로 돌아가서
              </a>{" "}
              첫 OST를 틀어볼까요?
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((entry, i) => (
              <div
                key={`${entry.videoId}-${entry.playedAt}-${i}`}
                className="group flex gap-3 p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
              >
                <div className="relative flex-shrink-0 w-32 aspect-video rounded-lg overflow-hidden bg-[var(--color-bg)]">
                  {entry.thumbnail ? (
                    <img
                      src={entry.thumbnail}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">
                      🎵
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono">
                    {formatDuration(entry.durationSeconds)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm line-clamp-2 leading-snug mb-1">
                    {entry.title}
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)] truncate mb-1">
                    {entry.gameName ? `🎮 ${entry.gameName}` : entry.channel}
                  </div>
                  <div className="text-[11px] text-[var(--color-text-muted)]">
                    🕐{" "}
                    {formatRelativeTime(new Date(entry.playedAt).toISOString())}
                  </div>
                </div>

                <div className="flex-shrink-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handlePlayAgain(entry)}
                    className="px-3 py-1 rounded-lg bg-[var(--color-accent)] text-[var(--color-bg)] text-xs font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
                  >
                    ▶ 다시 재생
                  </button>
                  <button
                    onClick={() => handleAddToQueue(entry)}
                    className="px-3 py-1 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs hover:border-[var(--color-accent)] transition-colors"
                  >
                    + 큐에 추가
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
