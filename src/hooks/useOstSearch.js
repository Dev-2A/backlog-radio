"use client";

import { useEffect, useState } from "react";

export default function useOstSearch(game) {
  const [videos, setVideos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!game) {
      setVideos(null);
      setError(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      setVideos(null);

      try {
        const res = await fetch(
          `/api/youtube/ost?game=${encodeURIComponent(game.name)}`,
        );
        const payload = await res.json();

        if (cancelled) return;

        if (!res.ok) {
          setError(payload.error ?? "OST를 찾지 못했습니다.");
          return;
        }

        setVideos(payload.videos);
      } catch (err) {
        if (cancelled) return;
        console.error("OST fetch error:", err);
        setError(`오류: ${err.message}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [game?.appId]); // appId 변경 시에만 refetch

  return { videos, loading, error };
}
