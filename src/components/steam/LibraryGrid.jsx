"use client";

import { useMemo, useState } from "react";
import GameCard from "./GameCard";
import LibraryControls from "./LibraryControls";

export default function LibraryGrid({ library, onFindOst }) {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("name-asc");
  const [search, setSearch] = useState("");

  const games = useMemo(() => {
    let source = [];

    if (filter === "all") {
      source = [
        ...library.groups.untouched,
        ...library.groups.barely,
        ...library.groups.lightly,
      ];
    } else if (filter === "played") {
      source = library.groups.played;
    } else {
      source = library.groups[filter] ?? [];
    }

    // 검색 필터
    if (search.trim()) {
      const needle = search.trim().toLowerCase();
      source = source.filter((g) => g.name.toLowerCase().includes(needle));
    }

    // 정렬
    const sorted = [...source];
    switch (sort) {
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name, "ko"));
        break;
      case "playtime-asc":
        sorted.sort((a, b) => a.playtimeMinutes - b.playtimeMinutes);
        break;
      case "playtime-desc":
        sorted.sort((a, b) => b.playtimeMinutes - a.playtimeMinutes);
        break;
      case "random":
        for (let i = sorted.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [sorted[i], sorted[j]] = [sorted[j], [sorted[i]]];
        }
        break;
    }

    return sorted;
  }, [library, filter, sort, search]);

  return (
    <div>
      <LibraryControls
        filter={filter}
        onFilterChange={setFilter}
        sort={sort}
        onSortChange={setSort}
        search={search}
        onSearchChange={setSearch}
        stats={library.stats}
      />

      {games.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-16">
          <div className="text-5xl mb-4 opacity-40">🔍</div>
          <div className="text-[var(--color-text-muted)]">
            {search.trim()
              ? `"${search}"와 일치하는 게임이 없어요.`
              : "이 카테고리에 해당하는 게임이 없어요."}
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-5xl mx-auto mb-4 text-sm text-[var(--color-text-muted)]">
            {games.length.toLocaleString()}개의 게임
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {games.map((game) => (
              <GameCard key={game.appId} game={game} onFindOst={onFindOst} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
