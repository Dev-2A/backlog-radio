"use client";

import { useEffect, useState } from "react";
import { getCachedOst, setCachedOst } from "@/lib/ostCache";

export default function useOstSearch(game) {
  const [videos, setVideos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    if (!game) {
      setVideos(null);
      setError(null);
      setFromCache(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setError(null);

      // 1) 캐시 먼저 확인 — 있으면 즉시 반환
      const cached = getCachedOst(game.name);
      if (cached) {
        if (cancelled) return;
        setVideos(cached);
        setFromCache(true);
        setLoading(false);
        return;
      }

      // 2) 캐시 없으면 API 호출
      setLoading(true);
      setVideos(null);
      setFromCache(false);

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
        setCachedOst(game.name, payload.videos);
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
  }, [game?.appId]);

  return { videos, loading, error, fromCache };
}
