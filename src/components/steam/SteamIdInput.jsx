"use client";

import { useState } from "react";

export default function SteamIdInput({ onProfileLoad }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/steam/profile?id=${encodeURIComponent(input.trim())}`,
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "알 수 없는 오류");
        return;
      }

      onProfileLoad(data.profile);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(`오류: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="SteamID64 또는 커스텀 URL (예: tangi826)"
          disabled={loading}
          className="flex-1 px-5 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          className="px-6 py-3 rounded-xl bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "찾는 중…" : "시작"}
        </button>
      </div>

      {error && (
        <div className="mt-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      <p className="mt-3 text-xs text-[var(--color-text-muted)] text-center">
        프로필이 <span className="text-[var(--color-accent)]">공개</span>로
        설정되어 있어야 합니다 ·{" "}
        <a
          href="https://steamcommunity.com/my/edit/settings"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[var(--color-text)]"
        >
          설정 열기
        </a>
      </p>
    </div>
  );
}
