"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadYouTubeIframeApi, YT_STATE } from "@/lib/youtubePlayer";

/**
 * YouTube 영상을 재생하는 훅.
 * @param {React.RefObject<HTMLDivElement>} wrapperRef — iframe을 심을 래퍼 div의 ref
 */
export default function useYouTubePlayer(wrapperRef) {
  const playerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState(YT_STATE.UNSTARTED);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let pollTimer = null;
    let innerTarget = null;

    loadYouTubeIframeApi()
      .then((YT) => {
        if (cancelled) return;

        const wrapper = wrapperRef.current;
        if (!wrapper) {
          setError("플레이어 래퍼를 찾을 수 없습니다.");
          return;
        }

        // React가 관리하지 않는 내부 div를 만들어 YouTube에 넘김
        innerTarget = document.createElement("div");
        wrapper.appendChild(innerTarget);

        playerRef.current = new YT.Player(innerTarget, {
          height: "100%",
          width: "100%",
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
          },
          events: {
            onReady: (e) => {
              if (cancelled) return;
              setReady(true);
              e.target.setVolume(volume);
            },
            onStateChange: (e) => {
              if (cancelled) return;
              setState(e.data);
              if (e.data === YT_STATE.PLAYING) {
                setDuration(e.target.getDuration());
              }
            },
            onError: (e) => {
              if (cancelled) return;
              const messages = {
                2: "영상 요청이 잘못되었습니다.",
                5: "HTML5 플레이어 오류가 발생했습니다.",
                100: "영상이 삭제되었거나 비공개입니다.",
                101: "이 영상은 외부 재생이 차단되어 있습니다.",
                150: "이 영상은 외부 재생이 차단되어 있습니다.",
              };
              setError(messages[e.data] ?? `재생 오류 (code: ${e.data})`);
            },
          },
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      });

    pollTimer = setInterval(() => {
      const p = playerRef.current;
      if (!p || typeof p.getCurrentTime !== "function") return;
      try {
        setCurrentTime(p.getCurrentTime() || 0);
      } catch {
        // noop
      }
    }, 1000);

    return () => {
      cancelled = true;
      if (pollTimer) clearInterval(pollTimer);

      if (
        playerRef.current &&
        typeof playerRef.current.destroy === "function"
      ) {
        try {
          playerRef.current.destroy();
        } catch {
          // noop
        }
        playerRef.current = null;
      }

      const wrapper = wrapperRef.current;
      if (wrapper) {
        while (wrapper.firstChild) {
          try {
            wrapper.removeChild(wrapper.firstChild);
          } catch {
            break;
          }
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playVideo = useCallback(
    (videoId) => {
      const p = playerRef.current;
      if (!p || !ready) return;
      setError(null);
      setCurrentVideoId(videoId);
      p.loadVideoById(videoId);
    },
    [ready],
  );

  const play = useCallback(() => {
    playerRef.current?.playVideo?.();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo?.();
  }, []);

  const togglePlay = useCallback(() => {
    if (state === YT_STATE.PLAYING) pause();
    else play();
  }, [state, play, pause]);

  const seek = useCallback((seconds) => {
    playerRef.current?.seekTo?.(seconds, true);
    setCurrentTime(seconds);
  }, []);

  const changeVolume = useCallback(
    (value) => {
      const v = Math.max(0, Math.min(100, value));
      setVolume(v);
      playerRef.current?.setVolume?.(v);
      if (v > 0 && muted) {
        playerRef.current?.unMute?.();
        setMuted(false);
      }
    },
    [muted],
  );

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.unMute?.();
      setMuted(false);
    } else {
      p.mute?.();
      setMuted(true);
    }
  }, [muted]);

  return {
    ready,
    state,
    isPlaying: state === YT_STATE.PLAYING,
    isBuffering: state === YT_STATE.BUFFERING,
    currentTime,
    duration,
    volume,
    muted,
    currentVideoId,
    error,
    playVideo,
    play,
    pause,
    togglePlay,
    seek,
    changeVolume,
    toggleMute,
  };
}
