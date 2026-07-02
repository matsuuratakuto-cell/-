import { Category } from "@/lib/types";

const STYLES: Record<Category, string> = {
  探究学習: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  部活動: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  修学旅行: "bg-sky-50 text-sky-700 ring-sky-200",
  ボランティア: "bg-amber-50 text-amber-700 ring-amber-200",
  その他: "bg-stone-100 text-stone-700 ring-stone-200",
};

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[category]}`}>
      {category}
    </span>
  );
}
