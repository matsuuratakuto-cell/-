"use client";

import Link from "next/link";
import { useState } from "react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { LateBadge, StatusBadge } from "@/components/StatusBadge";
import { SubmissionStats } from "@/components/SubmissionStats";
import { useStore } from "@/lib/store";

export function StudentRecordsClient({ studentId }: { studentId: string }) {
  const { getStudent, getRecordsByStudent, getTasksForStudent, getOpenTasksForStudent } = useStore();
  const [statusFilter, setStatusFilter] = useState<"all" | "未確認" | "確認済み">("all");
  const student = getStudent(studentId);
  const records = getRecordsByStudent(studentId).filter(
    (r) => statusFilter === "all" || r.status === statusFilter
  );

  if (!student) return <p className="text-sm text-stone-400">生徒が見つかりません。</p>;

  const tasks = getTasksForStudent(studentId);
  const openTasks = getOpenTasksForStudent(studentId);
  const submittedCount = tasks.length - openTasks.length;

  return (
    <div className="flex flex-col gap-5">
      <Link href="/teacher" className="text-xs text-stone-400 hover:text-stone-600">
        ← 担当生徒一覧に戻る
      </Link>

      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-mono text-base font-bold text-stone-800">{student.id}</p>
          <p className="text-xs text-stone-500">
            {student.points}pt ・ 連続記録 {student.streakDays}日 ・ 記録 {getRecordsByStudent(studentId).length}件
          </p>
        </div>
        {tasks.length > 0 ? (
          <SubmissionStats submitted={submittedCount} total={tasks.length} barColorClassName="bg-indigo-500" />
        ) : (
          <p className="text-xs text-stone-400">対応中のタスクはありません。</p>
        )}
      </div>

      <div className="flex gap-2">
        {(["all", "未確認", "確認済み"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              statusFilter === s ? "bg-stone-800 text-white" : "bg-white text-stone-500 ring-1 ring-stone-200"
            }`}
          >
            {s === "all" ? "すべて" : s}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {records.map((r) => (
          <Link
            key={r.id}
            href={`/teacher/records/${r.id}`}
            className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={r.category} />
                <StatusBadge status={r.status} />
                {r.submittedLate && <LateBadge />}
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
