"use client";

import GameImage from "../ui/GameImage";
import { BACKLOG_CATEGORIES, getBacklogCategory } from "@/lib/steam";

function formatPlaytime(minutes) {
  if (minutes === 0) return "미플레이";
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}시간`;
  return `${hours}시간 ${mins}분`;
}

export default function GameCard({ game, onFindOst }) {
  const category = BACKLOG_CATEGORIES[getBacklogCategory(game.playtimeMinutes)];

  return (
    <div className="group relative overflow-hidden rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all hover:-translate-y-1">
      {/* 이미지 (2:3 비율) */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <GameImage
          game={game}
          className="w-full h-full transition-transform duration-300 group-hover:scale-105"
        />

        {/* 카테고리 배지 */}
        <div className="absolute top-2 left-2">
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-xs">
            <span>{category.emoji}</span>
            <span className="text-white/90">{category.label}</span>
          </div>
        </div>

        {/* 호버 시 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <button
            onClick={() => onFindOst(game)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-accent)] text-[var(--color-bg)] text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            🎵 OST 찾기
          </button>
        </div>
      </div>

      {/* 타이틀 + 플레이타임 */}
      <div className="p-3">
        <div className="font-medium text-sm line-clamp-2 leading-snug mb-1">
          {game.name}
        </div>
        <div className="text-xs text-[var(--color-text-muted)]">
          ⏱ {formatPlaytime(game.playtimeMinutes)}
        </div>
      </div>
    </div>
  );
}
