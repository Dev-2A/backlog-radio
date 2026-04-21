"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import SteamIdInput from "@/components/steam/SteamIdInput";
import ProfileCard from "@/components/steam/ProfileCard";
import BacklogStats from "@/components/steam/BacklogStats";
import LibraryGrid from "@/components/steam/LibraryGrid";
import WeeklyPick from "@/components/steam/WeeklyPick";
import Spinner from "@/components/ui/Spinner";
import OstPanel from "@/components/player/OstPanel";
import { usePlayer } from "@/components/player/PlayerProvider";
import useLibrary from "@/hooks/useLibrary";
import { fetchTopOstPerGame } from "@/lib/ostBatch";
import { toast } from "@/lib/toast";

function toQueueItem(video, game) {
  return {
    videoId: video.videoId,
    title: video.title,
    channel: video.channel,
    thumbnail: video.thumbnail,
    durationSeconds: video.durationSeconds,
    gameName: game?.name ?? null,
    appId: game?.appId ?? null,
  };
}

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [weeklyError, setWeeklyError] = useState(null);

  const steamId = profile?.isPublic ? profile.steamId : null;
  const { data: library, loading, error } = useLibrary(steamId);
  const { playVideos, addToQueue } = usePlayer();

  const handlePlayOst = (video, videos, startIndex) => {
    const items = videos.map((v) => toQueueItem(v, selectedGame));
    playVideos(items, startIndex);
    setSelectedGame(null);
  };

  const handleEnqueueAll = (videos, game) => {
    const items = videos.map((v) => toQueueItem(v, game));
    addToQueue(items);
    setSelectedGame(null);
    toast.success(
      `🎵 ${game.name} 사운드트랙 ${items.length}곡을 큐에 추가했어요`,
    );
  };

  const handlePlayWeeklyAll = async (games) => {
    setWeeklyError(null);
    const results = await fetchTopOstPerGame(games);

    if (results.length === 0) {
      setWeeklyError("세 게임 모두 OST를 찾지 못했어요. 개별로 탐색해볼까요?");
      return;
    }

    const items = results.map(({ game, video }) => toQueueItem(video, game));
    playVideos(items, 0);

    if (results.length < games.length) {
      toast.info(
        `${results.length}개 OST를 찾았어요 · ${games.length - results.length}개는 검색 실패`,
      );
    } else {
      toast.success(`${results.length}곡의 OST를 재생 큐에 준비했어요`);
    }
  };

  return (
    <Container className="py-12 sm:py-20">
      {!profile && (
        <section className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-7xl mb-8">📻</div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            안 한 게임의 OST부터,
            <br />
            <span className="text-[var(--color-accent)]">부드럽게</span>.
          </h1>
          <p className="text-base sm:text-lg text-[var(--color-text-muted)] mb-4 leading-relaxed px-2">
            Steam 라이브러리에서 구매했지만 거의 안 한 게임들의 사운드트랙을{" "}
            <span className="hidden sm:inline">
              <br />
            </span>
            자동으로 찾아 작업 BGM 플레이리스트로 만들어 드려요.
          </p>
          <p className="text-sm text-[var(--color-text-muted)] mb-12">
            &quot;이 음악 좋네, 게임도 한번 해볼까?&quot; — 백로그 정복의 가장
            부드러운 시작.
          </p>
        </section>
      )}

      <section className="mb-12">
        {profile ? (
          <ProfileCard profile={profile} onReset={() => setProfile(null)} />
        ) : (
          <SteamIdInput onProfileLoad={setProfile} />
        )}
      </section>

      {!profile && (
        <section className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            {
              icon: "🎮",
              title: "백로그 자동 분석",
              desc: "Steam ID만 입력하면 플레이타임 기준으로 안 한 게임을 자동 분류합니다.",
            },
            {
              icon: "🎵",
              title: "OST 자동 발굴",
              desc: "게임별 공식/팬 제작 OST를 YouTube에서 자동으로 찾아 큐에 추가합니다.",
            },
            {
              icon: "🎧",
              title: "작업 모드",
              desc: "미니 플레이어로 접어두고 코딩하면서 들으세요. 자동 재생 + 기록 관리.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </section>
      )}

      {profile?.isPublic && loading && (
        <Spinner label="라이브러리를 불러오는 중…" />
      )}

      {profile?.isPublic && error && (
        <div className="max-w-xl mx-auto mt-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {profile?.isPublic && library && (
        <>
          <BacklogStats stats={library.stats} />

          <div className="mt-16">
            <WeeklyPick
              library={library}
              steamId={profile.steamId}
              onFindOst={setSelectedGame}
              onPlayAll={handlePlayWeeklyAll}
            />
          </div>

          {weeklyError && (
            <div className="max-w-3xl mx-auto -mt-8 mb-8 px-4 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
              ⚠️ {weeklyError}
            </div>
          )}

          <div className="mt-4">
            <LibraryGrid library={library} onFindOst={setSelectedGame} />
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
              <span>Step 12 · 히스토리 + 캐시 완료 · Next: UI 폴리싱</span>
            </div>
          </div>
        </>
      )}

      <OstPanel
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
        onPlay={handlePlayOst}
        onEnqueueAll={handleEnqueueAll}
      />
    </Container>
  );
}
