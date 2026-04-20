export default function Spinner({ label = "불러오는 중…" }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-[var(--color-surface)]"></div>
        <div className="absolute inset-0 rounded-full border-4 border-[var(--color-accent)] border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          📻
        </div>
      </div>
      <div className="text-sm text-[var(--color-text-muted)]">{label}</div>
    </div>
  );
}
