"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { COURSES, Course, Grade } from "@/lib/types";

const CLASS_OPTIONS = Array.from({ length: 8 }, (_, i) => `${i + 1}組`);

export default function StudentSetupPage() {
  const router = useRouter();
  const { currentStudentId, getStudent, updateStudentProfile } = useStore();
  const student = getStudent(currentStudentId);

  const [grade, setGrade] = useState<Grade>(student?.grade ?? 1);
  const [course, setCourse] = useState<Course>(student?.course ?? "総合コース");
  const [className, setClassName] = useState<string>(student?.className ?? "1組");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    updateStudentProfile(currentStudentId, { grade, course, className });
    setTimeout(() => router.push("/student"), 400);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-6 py-16">
      <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-600">
        <span>青楓館高等学院</span>
        <span className="text-stone-300">/</span>
        <span>初回プロフィール設定</span>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-center text-lg font-bold text-stone-800">プロフィール設定</h1>
        <p className="mb-6 text-center text-xs text-stone-500">
          初回ログイン時のみ、学年・コース・クラスを設定してください
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="block text-left text-xs font-semibold text-stone-600">
            学年
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value) as Grade)}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            >
              <option value={1}>1年</option>
              <option value={2}>2年</option>
              <option value={3}>3年</option>
            </select>
          </label>

          <label className="block text-left text-xs font-semibold text-stone-600">
            コース
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value as Course)}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            >
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-left text-xs font-semibold text-stone-600">
            クラス
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            >
              {CLASS_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {submitting ? "保存しています…" : "設定を完了する"}
          </button>
        </form>
      </div>

      <p className="mt-6 max-w-sm text-center text-[11px] text-stone-400">
        ※ ここで入力した内容は学籍情報としてデータベースに保存され、以降は教員側の一覧で学年・コース・クラス別に確認できます。
      </p>
    </main>
  );
}
