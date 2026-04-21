"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import useYouTubePlayer from "@/hooks/useYouTubePlayer";
import useQueue from "@/hooks/useQueue";
import { YT_STATE } from "@/lib/youtubePlayer";
import MiniPlayer from "./MiniPlayer";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  // ⚡ 핵심: id 대신 ref로 래퍼 지정
  const wrapperRef = useRef(null);
  const player = useYouTubePlayer(wrapperRef);
  const queue = useQueue();

  const lastPlayedRef = useRef(null);

  useEffect(() => {
    if (!player.ready) return;
    const item = queue.currentItem;
    if (!item) return;

    if (lastPlayedRef.current !== item.videoId) {
      lastPlayedRef.current = item.videoId;
      player.playVideo(item.videoId);

      window.dispatchEvent(
        new CustomEvent("backlog-radio:meta", {
          detail: {
            videoId: item.videoId,
            title: item.title,
            channel: item.channel,
            thumbnail: item.thumbnail,
            gameName: item.gameName,
          },
        }),
      );
    }
  }, [player.ready, queue.currentItem, player]);

  useEffect(() => {
    if (player.state === YT_STATE.ENDED) {
      queue.next();
    }
  }, [player.state, queue]);

  const playVideos = (items, startIndex = 0) => {
    queue.replaceQueue(items, startIndex);
  };

  const addToQueue = (items) => {
    queue.enqueue(items);
  };

  return (
    <PlayerContext.Provider
      value={{
        ...player,
        queue: queue.queue,
        currentIndex: queue.currentIndex,
        currentItem: queue.currentItem,
        shuffle: queue.shuffle,
        repeat: queue.repeat,
        hasNext: queue.hasNext,
        hasPrev: queue.hasPrev,
        setShuffle: queue.setShuffle,
        setRepeat: queue.setRepeat,
        playNext: queue.next,
        playPrev: queue.prev,
        removeAt: queue.removeAt,
        clearQueue: queue.clear,
        playVideos,
        addToQueue,
      }}
    >
      {/* ⚡ 핵심: id 제거하고 ref로 참조. 이 래퍼는 React가 관리. */}
      <div
        ref={wrapperRef}
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
