"use client";

import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import { usePlayer } from "@/components/player/PlayerProvider";
import { getHistoryStats } from "@/lib/history";
import { getCacheStats, clearOstCache } from "@/lib/ostCache";
import { formatDuration } from "@/lib/youtube";
import { toast } from "@/lib/toast";

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [cacheStats, setCacheStats] = useState(null);
  const [mounted, setMounted] = useState(false);
  const { playVideos } = usePlayer();

  useEffect(() => {
    setMounted(true);
    refresh();

    const onUpdate = () => refresh();
    window.addEventListener("backlog-radio:history-updated", onUpdate);
    return () =>
      window.removeEventListener("backlog-radio:history-updated", onUpdate);
  }, []);

  const refresh = () => {
    setStats(getHistoryStats());
    setCacheStats(getCacheStats());
  };

  const handleClearCache = () => {
    if (
      !confirm(
        "OST 캐시를 전부 삭제할까요? 다음 검색 시 YouTube API를 새로 호출합니다.",
      )
    )
      return;
    clearOstCache();
    refresh();
    toast.info("OST 캐시를 비웠어요");
  };

  if (!mounted || !stats) {
    return (
      <Container className="py-12">
        <div className="h-96" />
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">📊 통계</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-8">
          당신의 Backlog Radio 활동 기록
        </p>

        {stats.total === 0 ? (
          <div className="text-center py-20 text-[var(--color-text-muted)]">
            <div className="text-6xl mb-4 opacity-40">📊</div>
            <div className="text-lg mb-2">아직 통계가 없어요</div>
            <div className="text-sm">
              <a
                href="/"
                className="text-[var(--color-accent)] hover:underline"
              >
                OST를 몇 곡 들어보면
              </a>{" "}
              여기에 데이터가 쌓여요.
            </div>
          </div>
        ) : (
          <>
            {/* 요약 카드 4개 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              <SummaryCard
                emoji="🎵"
                label="총 재생"
                value={stats.total.toLocaleString()}
              />
              <SummaryCard
                emoji="💿"
                label="고유 곡"
                value={stats.uniqueVideos.toLocaleString()}
              />
              <SummaryCard
                emoji="🎮"
                label="게임"
                value={stats.uniqueGames.toLocaleString()}
              />
              <SummaryCard
                emoji="⏱"
                label="총 재생 시간"
                value={`${stats.totalPlayMinutes.toLocaleString()}분`}
              />
            </div>

            {/* 가장 많이 들은 게임 */}
            {stats.topGames.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold mb-4">
                  🏆 가장 많이 들은 게임
                </h2>
                <div className="space-y-2">
                  {stats.topGames.map((g, i) => (
                    <div
                      key={g.name}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
                    >
                      <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] font-bold flex items-center justify-center text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">🎮 {g.name}</div>
                      </div>
                      <div className="text-sm text-[var(--color-text-muted)]">
                        {g.count}회
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 가장 많이 들은 곡 */}
            {stats.topVideos.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold mb-4">🔁 가장 많이 들은 곡</h2>
                <div className="space-y-2">
                  {stats.topVideos.map((v, i) => (
                    <div
                      key={v.videoId}
                      className="group flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] font-bold flex items-center justify-center text-sm flex-shrink-0">
                        {i + 1}
                      </div>

                      {v.thumbnail && (
                        <img
                          src={v.thumbnail}
                          alt=""
                          loading="lazy"
                          className="w-20 aspect-video rounded object-cover flex-shrink-0"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate mb-0.5">
                          {v.title}
                        </div>
                        <div className="text-xs text-[var(--color-text-muted)] truncate">
                          {v.gameName ? `🎮 ${v.gameName}` : v.channel} ·{" "}
                          {formatDuration(v.durationSeconds)}
                        </div>
                      </div>

                      <div className="text-sm text-[var(--color-text-muted)] flex-shrink-0 mr-2">
                        {v.count}회
                      </div>

                      <button
                        onClick={() =>
                          playVideos(
                            [
                              {
                                videoId: v.videoId,
                                title: v.title,
                                channel: v.channel,
                                thumbnail: v.thumbnail,
                                durationSeconds: v.durationSeconds,
                                gameName: v.gameName,
                                appId: v.appId,
                              },
                            ],
                            0,
                          )
                        }
                        className="flex-shrink-0 w-9 h-9 rounded-lg bg-[var(--color-accent)] text-[var(--color-bg)] font-bold hover:bg-[var(--color-accent-hover)] transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="재생"
                      >
                        ▶
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 캐시 정보 */}
            <section className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold mb-1">⚡ OST 캐시</h3>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {cacheStats.count > 0 ? (
                      <>
                        {cacheStats.count}개 게임의 검색 결과가 캐시됨 · 최대
                        30일 보관
                        {cacheStats.oldestDate && (
                          <>
                            <br />
                            가장 오래된 캐시:{" "}
                            {cacheStats.oldestDate.toLocaleDateString("ko-KR")}
                          </>
                        )}
                      </>
                    ) : (
                      "아직 캐시된 검색 결과가 없어요."
                    )}
                  </p>
                </div>
                {cacheStats.count > 0 && (
                  <button
                    onClick={handleClearCache}
                    className="flex-shrink-0 px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-red-500/50 hover:text-red-400 transition-colors text-xs"
                  >
                    캐시 비우기
                  </button>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </Container>
  );
}

function SummaryCard({ emoji, label, value }) {
  return (
    <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
      <div className="text-2xl mb-2">{emoji}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs text-[var(--color-text-muted)]">{label}</div>
    </div>
  );
}
