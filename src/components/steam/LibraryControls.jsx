"use client";

import { BACKLOG_CATEGORIES } from "@/lib/steam";

export default function LibraryControls({
  filter,
  onFilterChange,
  sort,
  onSortChange,
  search,
  onSearchChange,
  stats,
}) {
  const filterOptions = [
    {
      key: "all",
      emoji: "📚",
      label: "전체 백로그",
      count: stats.backlogTotal,
    },
    ...Object.values(BACKLOG_CATEGORIES)
      .filter((c) => c.key !== "played")
      .map((c) => ({ ...c, count: stats[c.key] })),
  ];

  const sortOptions = [
    { key: "name-asc", label: "이름순 (ㄱ→ㅎ)" },
    { key: "playtime-asc", label: "플레이타임 적은순" },
    { key: "playtime-desc", label: "플레이타임 많은순" },
    { key: "random", label: "🎲 랜덤" },
  ];

  return (
    <div className="max-w-5xl mx-auto mb-6 space-y-4">
      {/* 검색창 */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="게임 이름 검색…"
          className="w-full px-5 py-3 pl-12 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
          🔍
        </span>
      </div>

      {/* 필터 + 정렬 */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* 카테고리 필터 (가로 스크롤) */}
        <div className="flex-1 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {filterOptions.map((opt) => {
            const active = filter === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => onFilterChange(opt.key)}
                className={`flex-shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--color-accent)] text-[var(--color-bg)] border-[var(--color-accent)]"
                    : "bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-accent)]"
                }`}
              >
                <span>{opt.emoji}</span>
                <span className="whitespace-nowrap">{opt.label}</span>
                <span
                  className={`text-xs px-1.5 rounded ${
                    active ? "bg-black/20" : "bg-[var(--color-bg)]"
                  }`}
                >
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 정렬 드롭다운 */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:border-[var(--color-accent)] cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
