export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          <span className="text-3xl transition-transform group-hover:scale-110">
            📻
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none">
              Backlog Radio
            </span>
            <span className="text-xs text-[var(--color-text-muted)] leading-none mt-1">
              안 한 게임의 OST부터
            </span>
          </div>
        </a>

        <nav className="flex items-center gap-1">
          <a
            href="/"
            className="px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
          >
            라이브러리
          </a>
          <a
            href="/history"
            className="px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
          >
            히스토리
          </a>
          <a
            href="/stats"
            className="px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
          >
            통계
          </a>
        </nav>
      </div>
    </header>
  );
}
