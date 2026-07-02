"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const LINKS = [
  { href: "/student", label: "ダッシュボード" },
  { href: "/student/records", label: "活動記録" },
  { href: "/student/records/new", label: "記録する" },
  { href: "/student/tasks", label: "タスク" },
];

export function StudentNav() {
  const pathname = usePathname();
  const { students, currentStudentId, setCurrentStudentId } = useStore();

  return (
    <div className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-semibold text-stone-400 hover:text-stone-600">
            ← モックTOP
          </Link>
          <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-200">
            生徒として表示中
          </span>
        </div>
        <label className="flex items-center gap-2 text-xs text-stone-500">
          表示する生徒（ログイン代替）
          <select
            value={currentStudentId}
            onChange={(e) => setCurrentStudentId(e.target.value)}
            className="rounded-md border border-stone-300 bg-white px-2 py-1 text-sm text-stone-700"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id}
              </option>
            ))}
          </select>
        </label>
      </div>
      <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${
                active ? "bg-teal-600 text-white" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
