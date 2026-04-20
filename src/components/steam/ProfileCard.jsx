"use client";

export default function ProfileCard({ profile, onReset }) {
  return (
    <div className="max-w-xl mx-auto p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
      <div className="flex items-center gap-4">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-20 h-20 rounded-xl border border-[var(--color-border)]"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold truncate">{profile.name}</h2>
            {profile.isPublic ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400">
                공개
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
                비공개
              </span>
            )}
          </div>

          <div className="mt-1 text-sm text-[var(--color-text-muted)] truncate">
            SteamID · {profile.steamId}
          </div>

          <div className="mt-3 flex items-center gap-3 text-xs">
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Steam 프로필 →
            </a>
            <button
              onClick={onReset}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              다른 ID로 변경
            </button>
          </div>
        </div>
      </div>

      {!profile.isPublic && (
        <div className="mt-4 px-4 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
          ⚠️ 프로필이 비공개라 라이브러리를 가져올 수 없어요.{" "}
          <a
            href="https://steamcommunity.com/my/edit/settings"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            공개로 변경
          </a>
          하면 계속할 수 있어요.
        </div>
      )}
    </div>
  );
}
