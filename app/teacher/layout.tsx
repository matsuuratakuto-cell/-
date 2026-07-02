import { TeacherNav } from "@/components/TeacherNav";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <TeacherNav />
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</div>
    </div>
  );
}
