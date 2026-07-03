"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";

const PERIODS = ["1学期", "2学期", "3学期", "通年"] as const;

export default function TeacherReportsPage() {
  const router = useRouter();
  const { currentTeacherId, teacherAssignments, students } = useStore();
  const assignedIds = teacherAssignments[currentTeacherId] ?? [];
  const assigned = students.filter((s) => assignedIds.includes(s.id));

  const [studentId, setStudentId] = useState(assigned[0]?.id ?? "");
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("1学期");

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-1 text-lg font-bold text-stone-800">AIサマリーレポート出力</h1>
      <p className="mb-6 text-xs text-stone-500">
        生徒1名分の活動記録とAI深掘りサマリーをもとに、期間前半・後半の変化（before/after）をまとめたレポートを生成します。
      </p>

      <div className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">対象生徒（システム番号）</label>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          >
            {assigned.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">出力期間</label>
          <div className="flex flex-wrap gap-2">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  period === p ? "bg-brand-600 text-white" : "bg-stone-100 text-stone-600"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          disabled={!studentId}
          onClick={() => router.push(`/teacher/reports/${studentId}?period=${encodeURIComponent(period)}`)}
          className="rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-40"
        >
          レポートを生成する
        </button>
      </div>
    </div>
  );
}
