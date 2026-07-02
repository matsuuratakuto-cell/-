"use client";

import Link from "next/link";
import { CategoryBadge } from "@/components/CategoryBadge";
import { LinkButton } from "@/components/Button";
import { SubmissionStats } from "@/components/SubmissionStats";
import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/types";

export default function StudentDashboard() {
  const { currentStudentId, getStudent, getRecordsByStudent, getTasksForStudent, getOpenTasksForStudent } = useStore();
  const student = getStudent(currentStudentId);
  const records = getRecordsByStudent(currentStudentId);
  const tasks = getTasksForStudent(currentStudentId);
  const openTasks = getOpenTasksForStudent(currentStudentId);
  const submittedCount = tasks.length - openTasks.length;

  if (!student) return null;

  const categoryCounts = CATEGORIES.map((c) => ({
    category: c,
    count: records.filter((r) => r.category === c).length,
  })).filter((c) => c.count > 0);

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="rounded-3xl border-2 border-stone-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-stone-800">{student.id} さんのポートフォリオ</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-4 py-1.5 text-sm font-bold text-teal-700 ring-2 ring-teal-200">
            ✨ 累計 <span className="text-lg text-teal-600">{student.points}</span> pt
          </span>
        </div>

        {tasks.length > 0 ? (
          <>
            <p className="mb-2 text-xs font-bold text-stone-400">タスクの提出状況</p>
            <SubmissionStats submitted={submittedCount} total={tasks.length} barColorClassName="bg-teal-500" />
          </>
        ) : (
          <p className="text-xs text-stone-400">現在、対応が必要なタスクはありません。</p>
        )}

        <div className="mt-4 flex gap-3 text-xs font-semibold text-stone-500">
          <span className="rounded-full bg-orange-50 px-3 py-1">🔥 連続記録 {student.streakDays} 日</span>
          <span className="rounded-full bg-sky-50 px-3 py-1">📝 記録数 {records.length} 件</span>
        </div>
      </div>

      {openTasks.length > 0 && (
        <Link
          href="/student/tasks"
          className="flex items-center justify-between rounded-2xl border-2 border-amber-300 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-800 shadow-[0_3px_0_0_#fcd34d] transition-transform hover:-translate-y-0.5"
        >
          <span>📌 未対応のタスクが {openTasks.length} 件あります</span>
          <span>確認する →</span>
        </Link>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {categoryCounts.length === 0 && (
          <p className="text-sm text-stone-400">まだ記録がありません。最初の記録を書いてみましょう。</p>
        )}
        {categoryCounts.map((c) => (
          <div
            key={c.category}
            className="flex items-center justify-between rounded-2xl border-2 border-stone-100 bg-white px-4 py-3.5 shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <CategoryBadge category={c.category} />
            <span className="text-sm font-bold text-stone-600">{c.count} 件蓄積</span>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border-2 border-stone-100 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-stone-700">最近の記録</h2>
          <Link href="/student/records" className="text-xs font-bold text-teal-600 hover:underline">
            すべて見る →
          </Link>
        </div>
        <ul className="flex flex-col divide-y divide-stone-100">
          {records.slice(0, 4).map((r) => (
            <li key={r.id}>
              <Link
                href={`/student/records/${r.id}`}
                className="flex items-center justify-between gap-3 rounded-xl py-2.5 px-2 -mx-2 hover:bg-stone-50"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <CategoryBadge category={r.category} />
                  <span className="truncate text-sm font-medium text-stone-700">{r.title}</span>
                </div>
                <span className="shrink-0 text-xs font-semibold text-stone-400">{r.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <LinkButton
        href="/student/records/new"
        color="teal"
        size="lg"
        className="fixed bottom-6 right-6"
      >
        ＋ 記録する
      </LinkButton>
    </div>
  );
}
