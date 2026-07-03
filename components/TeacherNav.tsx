"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const LINKS = [
  { href: "/teacher", label: "担当生徒" },
  { href: "/teacher/tasks", label: "宿題管理" },
  { href: "/teacher/reports", label: "サマリーレポート" },
];

export function TeacherNav() {
  const pathname = usePathname();
  const { teachers, currentTeacherId, setCurrentTeacherId } = useStore();

  return (
    <div className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-semibold text-stone-400 hover:text-stone-600">
            ← モックTOP
          </Link>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
            教員として表示中
          </span>
        </div>
        <label className="flex items-center gap-2 text-xs text-stone-500">
          表示する教員（ログイン代替）
          <select
            value={currentTeacherId}
            onChange={(e) => setCurrentTeacherId(e.target.value)}
            className="rounded-md border border-stone-300 bg-white px-2 py-1 text-sm text-stone-700"
          >
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
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
                active ? "bg-brand-600 text-white" : "text-stone-600 hover:bg-stone-100"
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
