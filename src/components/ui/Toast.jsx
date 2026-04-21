"use client";

import { useEffect, useState } from "react";

/**
 * 전역 토스트.
 * 사용법: window.dispatchEvent(new CustomEvent('backlog-radio:toast', {
 *   detail: { message, type: 'success'|'error'|'info', duration: 3000 }
 * }))
 */
export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const onToast = (e) => {
      const { message, type = "info", duration = 3000 } = e.detail;
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };

    window.addEventListener("backlog-radio:toast", onToast);
    return () => window.removeEventListener("backlog-radio:toast", onToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const styles = {
          success:
            "bg-[var(--color-accent)]/90 border-[var(--color-accent)] text-[var(--color-bg)]",
          error: "bg-red-500/90 border-red-400 text-white",
          info: "bg-[var(--color-surface)]/95 border-[var(--color-border)] text-[var(--color-text)]",
        };
        const icons = { success: "✓", error: "⚠", info: "ℹ" };
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md text-sm font-medium animate-slide-down ${styles[t.type]}`}
          >
            <span className="text-base">{icons[t.type]}</span>
            <span>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
