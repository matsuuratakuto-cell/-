"use client";

import Link from "next/link";
import { CategoryBadge } from "@/components/CategoryBadge";
import { SubmissionStats } from "@/components/SubmissionStats";
import { MOCK_NOW } from "@/lib/now";
import { useStore } from "@/lib/store";

export function TaskDetailClient({ taskId }: { taskId: string }) {
  const { tasks, students, getStudent, getSubmissionForTask, remindStudent, wasReminded } = useStore();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) return <p className="text-sm text-stone-400">タスクが見つかりません。</p>;

  const targetIds = task.targetType === "all" ? students.map((s) => s.id) : task.targetStudentIds;
  const overdue = new Date(task.dueAt) < MOCK_NOW;
  const submittedCount = targetIds.filter((id) => getSubmissionForTask(task.id, id)).length;

  const groups = new Map<string, string[]>();
  for (const id of targetIds) {
    const className = getStudent(id)?.className ?? "クラス未設定";
    groups.set(className, [...(groups.get(className) ?? []), id]);
  }
  const sortedClassNames = Array.from(groups.keys()).sort((a, b) => a.localeCompare(b, "ja", { numeric: true }));

  function renderStudentRow(id: string) {
    const submission = getSubmissionForTask(task!.id, id);
    const reminded = wasReminded(task!.id, id);
    return (
      <li key={id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
        <span className="font-mono text-sm text-stone-700">{id}</span>
        {submission ? (
          submission.submittedLate ? (
            <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
              遅延提出
            </span>
          ) : (
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
              提出済み（ボーナス付与）
            </span>
          )
        ) : (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-200">
              未提出
            </span>
            <button
              disabled={reminded}
              onClick={() => remindStudent(task!.id, id)}
              className="rounded-full border border-stone-300 px-2.5 py-1 text-[11px] font-medium text-stone-600 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {reminded ? "リマインド送信済み" : "リマインド送信"}
            </button>
          </div>
        )}
        {submission && (
          <Link href={`/teacher/records/${submission.id}`} className="text-xs text-indigo-600 hover:underline">
            記録を見る →
          </Link>
        )}
      </li>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <Link href="/teacher/tasks" className="text-xs text-stone-400 hover:text-stone-600">
        ← タスク一覧に戻る
      </Link>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <CategoryBadge category={task.category} />
          <span className="text-xs text-stone-400">{task.targetType === "all" ? "コース全員へ一斉発行" : "個別発行"}</span>
        </div>
        <h1 className="mb-1 text-lg font-bold text-stone-800">{task.title}</h1>
        <p className="mb-3 text-sm text-stone-600">{task.instruction}</p>
        <p className={`text-xs font-medium ${overdue ? "text-rose-600" : "text-stone-400"}`}>
          提出期限：{task.dueAt.replace("T", " ")}{overdue ? "（期限超過）" : ""}
        </p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-sm font-bold text-stone-700">全体の提出状況</h2>
        <SubmissionStats
          submitted={submittedCount}
          total={targetIds.length}
          barColorClassName={overdue ? "bg-rose-400" : "bg-indigo-500"}
        />
      </div>

      <div className="flex flex-col gap-4">
        {sortedClassNames.map((className) => {
          const ids = groups.get(className)!;
          const classSubmitted = ids.filter((id) => getSubmissionForTask(task.id, id)).length;
          return (
            <div key={className} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <p className="mb-2 text-xs font-semibold text-stone-700">{className}</p>
              <SubmissionStats submitted={classSubmitted} total={ids.length} barColorClassName="bg-indigo-400" className="mb-3" />
              <ul className="flex flex-col divide-y divide-stone-100">{ids.map((id) => renderStudentRow(id))}</ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
