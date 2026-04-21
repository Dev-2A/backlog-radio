"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadYouTubeIframeApi, YT_STATE } from "@/lib/youtubePlayer";

/**
 * YouTube 영상을 재생하는 훅.
 * @param {string} containerId — iframe을 심을 div의 id (unique)
 */
export default function useYouTubePlayer(containerId) {
  const playerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState(YT_STATE.UNSTARTED);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [error, setError] = useState(null);

  // 플레이어 초기화 (컴포넌트 마운트 시 한 번)
  useEffect(() => {
    let cancelled = false;
    let pollTimer = null;

    loadYouTubeIframeApi()
      .then((YT) => {
        if (cancelled) return;

        // container가 실제로 존재하는지 확인
        const el = document.getElementById(containerId);
        if (!el) {
          setError("플레이어 컨테이너를 찾을 수 없습니다.");
          return;
        }

        playerRef.current = new YT.Player(containerId, {
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
              // 에러 코드: 2=invalid, 5=html5, 100=notfound, 101/150=embed disabled
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

    // 현재 재생 시간 폴링 (1초마다)
    pollTimer = setInterval(() => {
      const p = playerRef.current;
      if (!p || typeof p.getCurrentTime !== "function") return;
      try {
        setCurrentTime(p.getCurrentTime() || 0);
      } catch {
        // 플레이어 파괴 중 호출되는 경우 무시
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
          // 이미 파괴된 경우 무시
        }
        playerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId]);

  // 영상 재생 명령
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
