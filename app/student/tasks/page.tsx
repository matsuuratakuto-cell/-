"use client";

import Link from "next/link";
import { CategoryBadge } from "@/components/CategoryBadge";
import { LateBadge } from "@/components/StatusBadge";
import { SubmissionStats } from "@/components/SubmissionStats";
import { MOCK_NOW } from "@/lib/now";
import { useStore } from "@/lib/store";

export default function StudentTasksPage() {
  const { currentStudentId, getTasksForStudent, getSubmissionForTask } = useStore();
  const tasks = getTasksForStudent(currentStudentId).sort((a, b) => (a.dueAt < b.dueAt ? -1 : 1));
  const submittedCount = tasks.filter((t) => getSubmissionForTask(t.id, currentStudentId)).length;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <h1 className="text-lg font-bold text-stone-800">先生からの宿題</h1>

      {tasks.length > 0 && (
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <p className="mb-2 text-xs text-stone-500">自分の提出状況</p>
          <SubmissionStats submitted={submittedCount} total={tasks.length} barColorClassName="bg-brand-500" />
        </div>
      )}

      {tasks.length === 0 && (
        <p className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-400">
          現在、対応が必要な宿題はありません。
        </p>
      )}

      {tasks.map((t) => {
        const submission = getSubmissionForTask(t.id, currentStudentId);
        const overdue = !submission && new Date(t.dueAt) < MOCK_NOW;
        return (
          <div key={t.id} className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={t.category} />
              {submission ? (
                submission.submittedLate ? (
                  <LateBadge />
                ) : (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                    提出済み
                  </span>
                )
              ) : overdue ? (
                <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
                  期限超過・未提出
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-200">
                  未提出
                </span>
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-800">{t.title}</h2>
              <p className="mt-1 text-sm text-stone-600">{t.instruction}</p>
            </div>
            <p className="text-xs text-stone-400">提出期限：{t.dueAt.replace("T", " ")}</p>
            {submission ? (
              <Link href={`/student/records/${submission.id}`} className="self-start rounded-full bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200">
                提出内容を見る
              </Link>
            ) : (
              <Link href={`/student/records/new?task=${t.id}`} className="self-start rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700">
                記録して提出する
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
