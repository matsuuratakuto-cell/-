"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { nowDateStr } from "@/lib/now";
import { useStore } from "@/lib/store";
import { CATEGORIES, Category, VISIBILITIES, Visibility } from "@/lib/types";

export default function NewRecordPage() {
  return (
    <Suspense fallback={null}>
      <NewRecordForm />
    </Suspense>
  );
}

function NewRecordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentStudentId, addRecord, getOpenTasksForStudent } = useStore();
  const openTasks = getOpenTasksForStudent(currentStudentId);
  const prefillTaskId = searchParams.get("task") ?? "";
  const prefillTask = openTasks.find((t) => t.id === prefillTaskId);

  const [category, setCategory] = useState<Category>(prefillTask?.category ?? "探究学習");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(nowDateStr());
  const [content, setContent] = useState("");
  const [reflection, setReflection] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("担当教員のみ");
  const [taskId, setTaskId] = useState<string>(prefillTaskId);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = title.trim().length > 0 && date.length > 0 && content.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    const record = addRecord({
      studentId: currentStudentId,
      category,
      title: title.trim(),
      date,
      content: content.trim(),
      reflection: reflection.trim() || undefined,
      photos: photoName ? [photoName] : [],
      visibility,
      taskId: taskId || undefined,
    });
    router.push(`/student/records/${record.id}/ai`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-lg font-bold text-stone-800">活動記録を書く</h1>
      <p className="mb-6 text-xs text-stone-500">
        保存すると、AI（Gemini）が自動で内容を読み取り、対話形式の深掘りを開始します。
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        {openTasks.length > 0 && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-stone-600">対応するタスク（任意）</label>
            <select
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            >
              <option value="">選択しない</option>
              {openTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}（期限：{t.dueAt.replace("T", " ")}）
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">カテゴリ</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  category === c ? "bg-teal-600 text-white" : "bg-stone-100 text-stone-600"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">タイトル（必須）</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：地域の空き家調査に行ってきた"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">活動日（必須）</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">内容（必須）</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="何をしたか、具体的に書いてみましょう"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">振り返り（任意）</label>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={2}
            placeholder="感じたこと・気づいたこと"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">写真・成果物の添付（任意・モック）</label>
          {photoName ? (
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <span className="rounded-md bg-stone-100 px-2 py-1">📎 {photoName}</span>
              <button type="button" onClick={() => setPhotoName(null)} className="text-rose-500 hover:underline">
                削除
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setPhotoName(`photo_${Math.floor(Math.random() * 900 + 100)}.jpg`)}
              className="rounded-lg border border-dashed border-stone-300 px-3 py-2 text-xs text-stone-500 hover:bg-stone-50"
            >
              ＋ ファイルを選択（モック）
            </button>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">公開範囲</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as Visibility)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          >
            {VISIBILITIES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="rounded-full bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          保存してAI深掘りを始める
        </button>
      </form>
    </div>
  );
}
