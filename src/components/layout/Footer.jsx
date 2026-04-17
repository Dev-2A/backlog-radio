export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-20">
      <div className="max-w-6xl mx-auto px-6 py-8">
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
      </div>
    </footer>
  );
}
