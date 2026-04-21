export default function EmptyState({
  emoji = "📭",
  title,
  description,
  action,
}) {
  return (
    <div className="text-center py-16 sm:py-20">
      <div className="text-5xl sm:text-6xl mb-4 opacity-40">{emoji}</div>
      <div className="text-base sm:text-lg font-medium mb-2">{title}</div>
      {description && (
        <div className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-sm mx-auto">
          {description}
        </div>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
