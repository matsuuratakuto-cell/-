import { ProgressBar } from "@/components/ProgressBar";

export function SubmissionStats({
  submitted,
  total,
  barColorClassName = "bg-indigo-500",
  className = "",
}: {
  submitted: number;
  total: number;
  barColorClassName?: string;
  className?: string;
}) {
  const notSubmitted = Math.max(total - submitted, 0);
  const rate = total > 0 ? Math.round((submitted / total) * 100) : 0;

  return (
    <div className={className}>
      <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="font-semibold text-emerald-700">{submitted}件提出済み</span>
        <span className="text-stone-300">・</span>
        <span className="font-semibold text-orange-600">{notSubmitted}件未提出</span>
        <span className="text-stone-300">・</span>
        <span className="font-semibold text-stone-700">達成率 {rate}%</span>
      </div>
      <ProgressBar value={submitted} max={total} colorClassName={barColorClassName} />
    </div>
  );
}
