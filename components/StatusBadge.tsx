export function StatusBadge({ status }: { status: "未確認" | "確認済み" }) {
  const style =
    status === "確認済み"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-orange-50 text-orange-700 ring-orange-200";
  return (
    <span className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}>
      {status}
    </span>
  );
}

export function LateBadge() {
  return (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
      遅延提出
    </span>
  );
}
