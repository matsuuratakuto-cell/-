"use client";

import Link from "next/link";
import { CategoryBadge } from "@/components/CategoryBadge";
import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/types";

export default function StudentDashboard() {
  const { currentStudentId, getStudent, getRecordsByStudent, getTasksForStudent, getOpenTasksForStudent } = useStore();
  const student = getStudent(currentStudentId);
  const records = getRecordsByStudent(currentStudentId);
  const tasks = getTasksForStudent(currentStudentId);
  const openTasks = getOpenTasksForStudent(currentStudentId);
  const submittedCount = tasks.length - openTasks.length;
  const rate = tasks.length > 0 ? Math.round((submittedCount / tasks.length) * 100) : 0;

  if (!student) return null;

  const categoryCounts = CATEGORIES.map((c) => ({
    category: c,
    count: records.filter((r) => r.category === c).length,
  })).filter((c) => c.count > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-stone-100 bg-white p-6 shadow-[0_8px_24px_-4px_rgba(53,79,142,0.18)]">
        <div className="mb-1 text-xs font-bold text-brand-500">{student.id} さんのポートフォリオ</div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="text-4xl font-extrabold tracking-tight text-brand-700">
            🔥 {student.streakDays}
            <span className="ml-1 text-base font-bold text-brand-400">日連続</span>
          </div>
          <div className="flex gap-2 text-xs font-bold text-stone-500">
            <span className="rounded-full bg-sky-50 px-3 py-1">📝 記録数 {records.length} 件</span>
          </div>
        </div>

        {tasks.length > 0 && (
          <div className="mt-4 rounded-2xl bg-brand-50 p-3.5">
            <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              <span className="font-bold text-emerald-700">{submittedCount}件提出済み</span>
              <span className="text-stone-300">・</span>
              <span className="font-bold text-orange-600">{tasks.length - submittedCount}件未提出</span>
              <span className="text-stone-300">・</span>
              <span className="font-bold text-brand-700">達成率 {rate}%</span>
            </div>
          </div>
        )}
      </div>

      {openTasks.length > 0 && (
        <Link
          href="/student/tasks"
          className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-800 shadow-[0_4px_16px_-4px_rgba(217,119,6,0.25)] transition-transform hover:-translate-y-0.5"
        >
          <span>📌 未対応の宿題が {openTasks.length} 件あります</span>
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
            className="flex items-center justify-between rounded-2xl border border-stone-100 bg-white px-4 py-3.5 shadow-[0_4px_16px_-4px_rgba(53,79,142,0.12)] transition-transform hover:-translate-y-0.5"
          >
            <CategoryBadge category={c.category} />
            <span className="text-sm font-bold text-stone-600">{c.count} 件蓄積</span>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-stone-100 bg-white p-5 shadow-[0_4px_16px_-4px_rgba(53,79,142,0.12)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-stone-700">最近の記録</h2>
          <Link href="/student/records" className="text-xs font-bold text-brand-600 hover:underline">
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
    </div>
  );
}
