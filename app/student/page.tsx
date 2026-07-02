"use client";

import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { CategoryBadge } from "@/components/CategoryBadge";
import { getAvatarStage, getNextStage, progressToNextStage } from "@/lib/avatar";
import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/types";

export default function StudentDashboard() {
  const { currentStudentId, getStudent, getRecordsByStudent, getOpenTasksForStudent } = useStore();
  const student = getStudent(currentStudentId);
  const records = getRecordsByStudent(currentStudentId);
  const openTasks = getOpenTasksForStudent(currentStudentId);

  if (!student) return null;

  const stage = getAvatarStage(student.points);
  const next = getNextStage(student.points);
  const progress = progressToNextStage(student.points);

  const categoryCounts = CATEGORIES.map((c) => ({
    category: c,
    count: records.filter((r) => r.category === c).length,
  })).filter((c) => c.count > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <Avatar stage={stage.stage} size={120} />
          <div className="text-sm font-semibold text-stone-700">{stage.name}</div>
        </div>
        <div className="flex flex-col justify-center gap-3 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h1 className="text-lg font-bold text-stone-800">{student.id} さんのポートフォリオ</h1>
            <span className="text-sm text-stone-500">
              累計 <span className="text-xl font-bold text-teal-600">{student.points}</span> pt
            </span>
          </div>
          <p className="text-xs text-stone-500">{stage.description}</p>
          {next ? (
            <div>
              <div className="mb-1 flex justify-between text-xs text-stone-500">
                <span>次のすがた「{next.name}」まで</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="text-xs font-semibold text-amber-600">最終形態に到達しました！🎉</div>
          )}
          <div className="flex gap-4 text-xs text-stone-500">
            <span>🔥 連続記録 {student.streakDays} 日</span>
            <span>📝 記録数 {records.length} 件</span>
          </div>
        </div>
      </div>

      {openTasks.length > 0 && (
        <Link
          href="/student/tasks"
          className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 hover:bg-amber-100"
        >
          <span>📌 未対応のタスクが {openTasks.length} 件あります</span>
          <span className="font-semibold">確認する →</span>
        </Link>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {categoryCounts.length === 0 && (
          <p className="text-sm text-stone-400">まだ記録がありません。最初の記録を書いてみましょう。</p>
        )}
        {categoryCounts.map((c) => (
          <div key={c.category} className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3">
            <CategoryBadge category={c.category} />
            <span className="text-sm text-stone-600">{c.count} 件蓄積</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-700">最近の記録</h2>
          <Link href="/student/records" className="text-xs font-semibold text-teal-600 hover:underline">
            すべて見る →
          </Link>
        </div>
        <ul className="flex flex-col divide-y divide-stone-100">
          {records.slice(0, 4).map((r) => (
            <li key={r.id}>
              <Link href={`/student/records/${r.id}`} className="flex items-center justify-between gap-3 py-2.5 hover:bg-stone-50">
                <div className="flex min-w-0 items-center gap-2">
                  <CategoryBadge category={r.category} />
                  <span className="truncate text-sm text-stone-700">{r.title}</span>
                </div>
                <span className="shrink-0 text-xs text-stone-400">{r.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/student/records/new"
        className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-teal-700"
      >
        ＋ 記録する
      </Link>
    </div>
  );
}
