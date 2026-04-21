"use client";

import { useEffect, useState } from "react";

export default function TempPlayer({ video, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (video) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [video, onClose]);

  if (!video || !visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] max-w-md w-[calc(100%-2rem)] p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-accent)] shadow-2xl animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="text-2xl">🎵</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-[var(--color-text-muted)] mb-1">
            선택됨 · Step 8에서 실제 플레이어로 교체됩니다
          </div>
          <div className="font-semibold text-sm truncate mb-1">
            {video.title}
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--color-accent)] hover:underline"
          >
            YouTube에서 열기 →
          </a>
        </div>
      </div>
    </div>
  );
}
