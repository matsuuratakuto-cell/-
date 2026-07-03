export function ProgressBar({
  value,
  max,
  colorClassName = "bg-brand-500",
  trackClassName = "bg-stone-100",
}: {
  value: number;
  max: number;
  colorClassName?: string;
  trackClassName?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full ${trackClassName}`}>
      <div className={`h-full rounded-full transition-all ${colorClassName}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
