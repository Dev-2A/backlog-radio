export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-20">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--color-text-muted)]">
          <div className="flex items-center gap-2">
            <span>📻</span>
            <span>Backlog Radio</span>
            <span className="text-[var(--color-border)]">·</span>
            <span>made with 🥤 & 💙</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Dev-2A/backlog-radio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-text)] transition-colors"
            >
              GitHub
            </a>
            <span className="text-[var(--color-border)]">·</span>
            <span>© 2026 Dev-2A</span>
          </div>
        </div>

        {/* 단축키 힌트 */}
        <div className="text-[10px] text-[var(--color-text-muted)] text-center flex flex-wrap justify-center gap-x-3 gap-y-1">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] font-mono">
              Space
            </kbd>{" "}
            재생/정지
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] font-mono">
              ←/→
            </kbd>{" "}
            10초 이동
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] font-mono">
              ⇧+←/→
            </kbd>{" "}
            이전/다음 곡
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] font-mono">
              M
            </kbd>{" "}
            음소거
          </span>
        </div>
      </div>
    </footer>
  );
}
