"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { CATEGORIES, Category, TaskTargetType } from "@/lib/types";

export default function NewTaskPage() {
  const router = useRouter();
  const { currentTeacherId, students, teacherAssignments, addTask } = useStore();
  const assignedIds = teacherAssignments[currentTeacherId] ?? [];
  const assignedStudents = students.filter((s) => assignedIds.includes(s.id));

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("探究学習");
  const [instruction, setInstruction] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [targetType, setTargetType] = useState<TaskTargetType>("all");
  const [targetStudentIds, setTargetStudentIds] = useState<string[]>([]);

  const canSubmit =
    title.trim().length > 0 &&
    instruction.trim().length > 0 &&
    dueAt.length > 0 &&
    (targetType === "all" || targetStudentIds.length > 0);

  function toggleStudent(id: string) {
    setTargetStudentIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const task = addTask({
      title: title.trim(),
      category,
      instruction: instruction.trim(),
      dueAt,
      targetType,
      targetStudentIds: targetType === "all" ? [] : targetStudentIds,
      createdBy: currentTeacherId,
    });
    router.push(`/teacher/tasks/${task.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-lg font-bold text-stone-800">記録する宿題を発行する</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">対象活動（タイトル）</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：1学期 探究中間ふりかえり"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">カテゴリ</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  category === c ? "bg-brand-600 text-white" : "bg-stone-100 text-stone-600"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">記録の観点・指示内容</label>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            rows={3}
            placeholder="生徒に何を記録してほしいか、具体的に書いてください"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">提出期限</label>
          <input
            type="datetime-local"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">発行対象</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTargetType("all")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                targetType === "all" ? "bg-brand-600 text-white" : "bg-stone-100 text-stone-600"
              }`}
            >
              コース全員へ一斉発行
            </button>
            <button
              type="button"
              onClick={() => setTargetType("individual")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                targetType === "individual" ? "bg-brand-600 text-white" : "bg-stone-100 text-stone-600"
              }`}
            >
              個別に指定する
            </button>
          </div>
        </div>

        {targetType === "individual" && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-stone-600">対象生徒（システム番号）</label>
            <div className="flex flex-wrap gap-2">
              {assignedStudents.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => toggleStudent(s.id)}
                  className={`rounded-full px-3 py-1.5 font-mono text-xs font-medium ${
                    targetStudentIds.includes(s.id) ? "bg-brand-600 text-white" : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {s.id}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          発行する
        </button>
      </form>
    </div>
  );
}
