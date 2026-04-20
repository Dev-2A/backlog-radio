"use client";

import { useEffect, useState } from "react";

export default function useLibrary(steamId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!steamId) {
      setData(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/steam/library?steamId=${encodeURIComponent(steamId)}`,
        );
        const payload = await res.json();

        if (cancelled) return;

        if (!res.ok) {
          setError(payload.error ?? "라이브러리를 가져오지 못했습니다.");
          setData(null);
          return;
        }

        setData(payload);
      } catch (err) {
        if (cancelled) return;
        console.error("Library fetch error:", err);
        setError(`오류: ${err.message}`);
        setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [steamId]);

  return { data, loading, error };
}
