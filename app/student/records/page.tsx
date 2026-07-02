"use client";

import Link from "next/link";
import { useState } from "react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { LateBadge, StatusBadge } from "@/components/StatusBadge";
import { useStore } from "@/lib/store";
import { CATEGORIES, Category } from "@/lib/types";

export default function StudentRecordsPage() {
  const { currentStudentId, getRecordsByStudent } = useStore();
  const [filter, setFilter] = useState<Category | "all">("all");
  const records = getRecordsByStudent(currentStudentId).filter(
    (r) => filter === "all" || r.category === filter
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-stone-800">活動記録一覧</h1>
        <Link href="/student/records/new" className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
          ＋ 新しく記録する
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1 text-xs font-medium ${filter === "all" ? "bg-stone-800 text-white" : "bg-white text-stone-500 ring-1 ring-stone-200"}`}
        >
          すべて
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${filter === c ? "bg-stone-800 text-white" : "bg-white text-stone-500 ring-1 ring-stone-200"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {records.length === 0 && (
          <p className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-400">
            該当する記録がありません。
          </p>
        )}
        {records.map((r) => (
          <Link
            key={r.id}
            href={`/student/records/${r.id}`}
            className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={r.category} />
                <StatusBadge status={r.status} />
                {r.submittedLate && <LateBadge />}
                {r.aiDialogue.status !== "closed" && (
                  <span className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-200">
                    AI対話：{r.aiDialogue.status === "awaiting_continue_choice" ? "継続選択待ち" : "進行中"}
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-stone-800">{r.title}</div>
            </div>
            <div className="shrink-0 text-xs text-stone-400">{r.date}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
