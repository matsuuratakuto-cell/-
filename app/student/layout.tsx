import { StudentNav } from "@/components/StudentNav";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <StudentNav />
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</div>
    </div>
  );
}
