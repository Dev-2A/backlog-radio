"use client";

import { BACKLOG_CATEGORIES } from "@/lib/steam";

export default function BacklogStats({ stats }) {
  const backlogRatio =
    stats.total > 0 ? Math.round((stats.backlogTotal / stats.total) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* 상단 요약 */}
      <div className="text-center mb-8">
        <div className="text-sm text-[var(--color-text-muted)] mb-2">
          총 {stats.total.toLocaleString()}개의 게임 ·{" "}
          {stats.totalPlaytimeHours.toLocaleString()}시간 플레이
        </div>
        <div className="text-4xl sm:text-5xl font-bold mb-2">
          <span className="text-[var(--color-accent)]">
            {stats.backlogTotal.toLocaleString()}
          </span>
          개의 게임이 당신을 기다리고 있어요
        </div>
        <div className="text-sm text-[var(--color-text-muted)]">
          라이브러리의{" "}
          <span className="text-[var(--color-accent)]">{backlogRatio}%</span>가
          아직 깊게 만나지 못한 게임들 · 음악부터 천천히 시작해볼까요?
        </div>
      </div>

      {/* 4개 카테고리 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.values(BACKLOG_CATEGORIES).map((cat) => {
          const count = stats[cat.key];
          const isEmpty = count === 0;
          return (
            <div
              key={cat.key}
              className={`p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] transition-opacity ${
                isEmpty ? "opacity-40" : ""
              }`}
            >
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <div className="text-2xl font-bold mb-1">
                {count.toLocaleString()}
              </div>
              <div className="text-xs font-semibold mb-1">{cat.label}</div>
              <div className="text-[10px] text-[var(--color-text-muted)] leading-tight">
                {cat.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
