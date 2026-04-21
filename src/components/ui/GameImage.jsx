"use client";

import { useState } from "react";

export default function GameImage({ game, className = "" }) {
  const [src, setSrc] = useState(game.libraryUrl);
  const [fallbackStage, setFallbackStage] = useState(0);

  const handleError = () => {
    // 1차 fallback: 가로 헤더 이미지
    if (fallbackStage === 0 && game.headerUrl) {
      setSrc(game.headerUrl);
      setFallbackStage(1);
      return;
    }
    // 2차 fallback: 없음 (빈 상태로 둠, CSS가 처리)
    setSrc(null);
    setFallbackStage(2);
  };

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-hover)] ${className}`}
      >
        <div className="text-5xl opacity-30">🎮</div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={game.name}
      loading="lazy"
      onError={handleError}
      className={`object-cover ${className}`}
    />
  );
}
