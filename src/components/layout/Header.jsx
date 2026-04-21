export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
        <a href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
          <span className="text-2xl sm:text-3xl transition-transform group-hover:scale-110 flex-shrink-0">
            📻
          </span>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-base sm:text-lg leading-none truncate">
              Backlog Radio
            </span>
            <span className="hidden sm:block text-xs text-[var(--color-text-muted)] leading-none mt-1">
              안 한 게임의 OST부터
            </span>
          </div>
        </a>

        <nav className="flex items-center gap-0.5 sm:gap-1">
          <NavLink href="/" emoji="🎮" label="라이브러리" />
          <NavLink href="/history" emoji="📜" label="히스토리" />
          <NavLink href="/stats" emoji="📊" label="통계" />
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, emoji, label }) {
  return (
    <a
      href={href}
      className="px-2.5 sm:px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors flex items-center gap-1.5"
    >
      <span>{emoji}</span>
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
