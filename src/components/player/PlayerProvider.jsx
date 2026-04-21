"use client";

import { createContext, useContext } from "react";
import useYouTubePlayer from "@/hooks/useYouTubePlayer";
import MiniPlayer from "./MiniPlayer";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const player = useYouTubePlayer("yt-player-container");

  return (
    <PlayerContext.Provider value={player}>
      {/* 실제 iframe이 박히는 DOM. 화면에 숨김 처리 */}
      <div
        id="yt-player-container"
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-9999px",
          top: "-9999px",
          width: "1px",
          height: "1px",
          pointerEvents: "none",
        }}
      />
      {children}
      <MiniPlayer />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayer는 PlayerProvider 내부에서만 사용해야 합니다.");
  }
  return ctx;
}
