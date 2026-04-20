"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import SteamIdInput from "@/components/steam/SteamIdInput";
import ProfileCard from "@/components/steam/ProfileCard";

export default function Home() {
  const [profile, setProfile] = useState(null);

  return (
    <Container className="py-20">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto">
        <div className="text-7xl mb-8">📻</div>

        <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">
          안 한 게임의 OST부터,
          <br />
          <span className="text-[var(--color-accent)]">부드럽게</span>.
        </h1>

        <p className="text-lg text-[var(--color-text-muted)] mb-4 leading-relaxed">
          Steam 라이브러리에서 구매했지만 거의 안 한 게임들의 사운드트랙을
          <br />
          자동으로 찾아 작업 BGM 플레이리스트로 만들어 드려요.
        </p>

        <p className="text-sm text-[var(--color-text-muted)] mb-12">
          &quot;이 음악 좋네, 게임도 한번 해볼까?&quot; — 백로그 정복의 가장
          부드러운 시작.
        </p>

        {/* Input 또는 Profile 카드 */}
        <div className="mb-4">
          {profile ? (
            <ProfileCard profile={profile} onReset={() => setProfile(null)} />
          ) : (
            <SteamIdInput onProfileLoad={setProfile} />
          )}
        </div>
      </section>

      {/* Feature Preview — 프로필 로드 전에만 표시 */}
      {!profile && (
        <section className="mt-24 grid sm:grid-cols-3 gap-4">
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

      {/* Step 4 예고 */}
      {profile && profile.isPublic && (
        <section className="mt-12 max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
            <span>Step 3 · 프로필 연동 완료 · Next: 라이브러리 페칭</span>
          </div>
        </section>
      )}
    </Container>
  );
}
