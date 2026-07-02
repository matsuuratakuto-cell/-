"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { getAvatarStage } from "@/lib/avatar";
import { useStore } from "@/lib/store";

export default function TeacherDashboard() {
  const { currentTeacherId, teachers, teacherAssignments, students, records, nameMapping } = useStore();
  const [showMapping, setShowMapping] = useState(false);

  const teacher = teachers.find((t) => t.id === currentTeacherId);
  const assignedIds = teacherAssignments[currentTeacherId] ?? [];
  const assigned = students.filter((s) => assignedIds.includes(s.id));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-stone-800">{teacher?.name} の担当生徒</h1>
        <button
          onClick={() => setShowMapping((v) => !v)}
          className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100"
        >
          {showMapping ? "校内対応表を隠す" : "校内対応表を開く（デモ）"}
        </button>
      </div>

      {showMapping && (
        <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4 text-xs text-amber-800">
          <p className="mb-2 font-semibold">
            ⚠️ この対応表はシステム外（校内で別管理）の想定データです。DBには氏名を一切保持しません。
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
            {assignedIds.map((id) => (
              <li key={id}>
                <span className="font-mono">{id}</span> = {nameMapping[id]}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {assigned.map((s) => {
          const studentRecords = records.filter((r) => r.studentId === s.id);
          const unconfirmed = studentRecords.filter((r) => r.status === "未確認").length;
          const stage = getAvatarStage(s.points);
          return (
            <Link
              key={s.id}
              href={`/teacher/students/${s.id}`}
              className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <Avatar stage={stage.stage} size={56} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-sm font-bold text-stone-800">{s.id}</p>
                  {unconfirmed > 0 && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-700">
                      未確認 {unconfirmed}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500">
                  {stage.name} ・ {s.points}pt ・ 記録 {studentRecords.length} 件
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
