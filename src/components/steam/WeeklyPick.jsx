"use client";

import { useMemo, useState } from "react";
import GameImage from "@/components/ui/GameImage";
import Spinner from "@/components/ui/Spinner";
import { BACKLOG_CATEGORIES, getBacklogCategory } from "@/lib/steam";
import {
  pickWeeklyBacklog,
  getIsoWeekKey,
  formatTimeUntilNextWeek,
} from "@/lib/weekly";

export default function WeeklyPick({ library, steamId, onFindOst, onPlayAll }) {
  const [timeLabel, setTimeLabel] = useState(() => formatTimeUntilNextWeek());
  const [loadingPlayAll, setLoadingPlayAll] = useState(false);

  // 1분마다 갱신 카운터 업데이트
  useMemo(() => {
    const timer = setInterval(
      () => setTimeLabel(formatTimeUntilNextWeek()),
      60_000,
    );
    return () => clearInterval(timer);
  }, []);

  // 백로그(untouched + barely + lightly) 통합 후 주간 추천 선정
  const weeklyGames = useMemo(() => {
    const backlog = [
      ...library.groups.untouched,
      ...library.groups.barely,
      ...library.groups.lightly,
    ];
    return pickWeeklyBacklog(backlog, steamId, 3);
  }, [library, steamId]);

  const weekKey = getIsoWeekKey();

  if (weeklyGames.length === 0) {
    return null;
  }

  const handlePlayAll = async () => {
    setLoadingPlayAll(true);
    try {
      await onPlayAll(weeklyGames);
    } finally {
      setLoadingPlayAll(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto mb-16">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📅</span>
          <h2 className="text-2xl sm:text-3xl font-bold">이번 주의 백로그</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] font-mono">
            {weekKey}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm text-[var(--color-text-muted)]">
            알고리즘이 뽑아준 3개의 게임. 일단 음악부터 틀어볼까요?
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--color-text-muted)]">
              🔄 {timeLabel}
            </span>
            <button
              onClick={handlePlayAll}
              disabled={loadingPlayAll}
              className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {loadingPlayAll ? (
                <>
                  <span className="animate-pulse">…</span>
                  <span>준비 중</span>
                </>
              ) : (
                <>▶ 이 3곡 전부 틀기</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 추천 카드 3개 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {weeklyGames.map((game, i) => {
          const category =
            BACKLOG_CATEGORIES[getBacklogCategory(game.playtimeMinutes)];
          return (
            <div
              key={game.appId}
              className="group relative overflow-hidden rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all"
            >
              {/* 순번 배지 */}
              <div className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] font-bold text-sm flex items-center justify-center shadow-lg">
                {i + 1}
              </div>

              {/* 가로 헤더 이미지 */}
              <div className="relative aspect-[460/215] overflow-hidden">
                <img
                  src={game.headerUrl}
                  alt={game.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // header 실패 시 library 이미지로 fallback
                    if (e.currentTarget.src !== game.libraryUrl) {
                      e.currentTarget.src = game.libraryUrl;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] inline-flex items-center gap-1">
                    <span>{category.emoji}</span>
                    <span>{category.label}</span>
                  </span>
                </div>

                <h3 className="font-bold text-base line-clamp-2 leading-snug mb-3">
                  {game.name}
                </h3>

                <button
                  onClick={() => onFindOst(game)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors text-sm font-medium"
                >
                  🎵 OST 찾기
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
