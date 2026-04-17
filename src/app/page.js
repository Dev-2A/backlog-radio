export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className="text-7xl mb-6">📻</div>
        <h1 className="text-5xl font-bold mb-4">Backlog Radio</h1>
        <p className="text-xl text-[var(--color-text-muted)] mb-2">
          안 한 게임의 OST부터 들어보기
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mb-12">
          Steam 백로그를 음악으로 만나는 가장 부드러운 입문 방법
        </p>
        <div className="inline-block px-4 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
          Step 1 setup complete · Next: Steam ID 연동
        </div>
      </div>
    </main>
  );
}
