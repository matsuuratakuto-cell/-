"use client";

import Link from "next/link";
import { CategoryBadge } from "@/components/CategoryBadge";
import { SubmissionStats } from "@/components/SubmissionStats";
import { MOCK_NOW } from "@/lib/now";
import { useStore } from "@/lib/store";

export default function TeacherTasksPage() {
  const { tasks, students, getSubmissionForTask } = useStore();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-stone-800">タスク管理</h1>
        <Link href="/teacher/tasks/new" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          ＋ タスクを発行する
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {tasks.map((t) => {
          const targetIds = t.targetType === "all" ? students.map((s) => s.id) : t.targetStudentIds;
          const submittedCount = targetIds.filter((id) => getSubmissionForTask(t.id, id)).length;
          const overdue = new Date(t.dueAt) < MOCK_NOW;
          return (
            <Link
              key={t.id}
              href={`/teacher/tasks/${t.id}`}
              className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <CategoryBadge category={t.category} />
                  <span className="text-xs text-stone-400">{t.targetType === "all" ? "コース全員" : `個別指定（${targetIds.length}名）`}</span>
                  {overdue && (
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700">期限超過</span>
                  )}
                </div>
                <div className="text-sm font-semibold text-stone-800">{t.title}</div>
                <div className="text-xs text-stone-400">期限：{t.dueAt.replace("T", " ")}</div>
              </div>
              <SubmissionStats
                submitted={submittedCount}
                total={targetIds.length}
                barColorClassName={overdue ? "bg-rose-400" : "bg-indigo-500"}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
