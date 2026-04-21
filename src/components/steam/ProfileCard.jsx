"use client";

export default function ProfileCard({ profile, onReset }) {
  return (
    <div className="max-w-xl mx-auto">
      <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-[var(--color-border)]"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold truncate">
                {profile.name}
              </h2>
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

            <div className="mt-1 text-xs sm:text-sm text-[var(--color-text-muted)] truncate font-mono">
              {profile.steamId}
            </div>

            <div className="mt-3 flex items-center gap-3 text-xs flex-wrap">
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
      </div>

      {!profile.isPublic && (
        <div className="mt-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
          <div className="text-sm text-yellow-400 font-medium mb-2">
            🔒 프로필이 비공개 상태예요
          </div>
          <div className="text-xs text-yellow-400/80 leading-relaxed space-y-1 mb-3">
            <div>
              라이브러리를 가져오려면 두 가지 설정을 공개로 바꿔야 해요:
            </div>
            <ol className="list-decimal list-inside space-y-0.5 ml-1 mt-2">
              <li>
                <strong>프로필</strong> → 공개
              </li>
              <li>
                <strong>게임 상세 정보</strong> → 공개
              </li>
            </ol>
          </div>
          <a
            href="https://steamcommunity.com/my/edit/settings"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 text-xs font-medium transition-colors"
          >
            Steam 프라이버시 설정 열기 →
          </a>
        </div>
      )}
    </div>
  );
}
