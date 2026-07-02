"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { COURSES, Course, Grade } from "@/lib/types";

type SortKey = "id" | "grade" | "course" | "className";

export default function TeacherDashboard() {
  const { currentTeacherId, teachers, teacherAssignments, students, records, nameMapping, getOpenTasksForStudent } =
    useStore();
  const [showMapping, setShowMapping] = useState(false);
  const [gradeFilter, setGradeFilter] = useState<Grade | "all">("all");
  const [courseFilter, setCourseFilter] = useState<Course | "all">("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("id");

  const teacher = teachers.find((t) => t.id === currentTeacherId);
  const assignedIds = teacherAssignments[currentTeacherId] ?? [];
  const assigned = students.filter((s) => assignedIds.includes(s.id));

  const classOptions = useMemo(
    () => Array.from(new Set(assigned.map((s) => s.className))).sort(),
    [assigned]
  );

  const visible = useMemo(() => {
    return assigned
      .filter((s) => gradeFilter === "all" || s.grade === gradeFilter)
      .filter((s) => courseFilter === "all" || s.course === courseFilter)
      .filter((s) => classFilter === "all" || s.className === classFilter)
      .sort((a, b) => {
        switch (sortKey) {
          case "grade":
            return a.grade - b.grade || a.id.localeCompare(b.id);
          case "course":
            return a.course.localeCompare(b.course, "ja") || a.id.localeCompare(b.id);
          case "className":
            return a.className.localeCompare(b.className, "ja", { numeric: true }) || a.id.localeCompare(b.id);
          default:
            return a.id.localeCompare(b.id);
        }
      });
  }, [assigned, gradeFilter, courseFilter, classFilter, sortKey]);

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

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-stone-200 bg-white p-3">
        <label className="flex items-center gap-1.5 text-xs text-stone-500">
          学年
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value === "all" ? "all" : (Number(e.target.value) as Grade))}
            className="rounded-md border border-stone-300 px-2 py-1 text-xs text-stone-700"
          >
            <option key="all" value="all">すべて</option>
            <option key={1} value={1}>1年</option>
            <option key={2} value={2}>2年</option>
            <option key={3} value={3}>3年</option>
          </select>
        </label>

        <label className="flex items-center gap-1.5 text-xs text-stone-500">
          コース
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value as Course | "all")}
            className="rounded-md border border-stone-300 px-2 py-1 text-xs text-stone-700"
          >
            {[
              <option key="all" value="all">すべて</option>,
              ...COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              )),
            ]}
          </select>
        </label>

        <label className="flex items-center gap-1.5 text-xs text-stone-500">
          クラス
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="rounded-md border border-stone-300 px-2 py-1 text-xs text-stone-700"
          >
            {[
              <option key="all" value="all">すべて</option>,
              ...classOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              )),
            ]}
          </select>
        </label>

        <div className="ml-auto flex items-center gap-1.5 text-xs text-stone-500">
          並び替え
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-md border border-stone-300 px-2 py-1 text-xs text-stone-700"
          >
            <option key="id" value="id">システム番号順</option>
            <option key="grade" value="grade">学年順</option>
            <option key="course" value="course">コース順</option>
            <option key="className" value="className">クラス順</option>
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {visible.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-400">
            該当する生徒がいません。
          </p>
        )}
        {visible.map((s) => {
          const studentRecords = records.filter((r) => r.studentId === s.id);
          const unconfirmed = studentRecords.filter((r) => r.status === "未確認").length;
          const openCount = getOpenTasksForStudent(s.id).length;
          return (
            <Link
              key={s.id}
              href={`/teacher/students/${s.id}`}
              className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-sm font-bold text-stone-800">{s.id}</p>
                  <div className="flex items-center gap-1.5">
                    {unconfirmed > 0 && (
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-700">
                        未確認 {unconfirmed}
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        openCount === 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      未提出 {openCount}件
                    </span>
                  </div>
                </div>
                <p className="text-xs text-stone-500">
                  {s.grade}年{s.className} ・ {s.course}
                </p>
                <p className="text-xs text-stone-500">
                  {s.points}pt ・ 記録 {studentRecords.length} 件
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
