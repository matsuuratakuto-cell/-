"use client";

import { Avatar } from "@/components/Avatar";
import { AVATAR_STAGES, getAvatarStage, getNextStage, progressToNextStage } from "@/lib/avatar";
import { useStore } from "@/lib/store";

export default function StudentAvatarPage() {
  const { currentStudentId, getStudent, pointEvents } = useStore();
  const student = getStudent(currentStudentId);
  const events = pointEvents.filter((p) => p.studentId === currentStudentId);

  if (!student) return null;

  const stage = getAvatarStage(student.points);
  const next = getNextStage(student.points);
  const progress = progressToNextStage(student.points);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <Avatar stage={stage.stage} size={180} />
        <h1 className="text-lg font-bold text-stone-800">{stage.name}</h1>
        <p className="max-w-sm text-center text-xs text-stone-500">{stage.description}</p>
        <div className="w-full max-w-xs">
          {next ? (
            <>
              <div className="mb-1 flex justify-between text-xs text-stone-500">
                <span>次のすがた「{next.name}」まで</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                <div className="h-full rounded-full bg-teal-500" style={{ width: `${progress}%` }} />
              </div>
            </>
          ) : (
            <p className="text-center text-xs font-semibold text-amber-600">最終形態に到達しました！🎉</p>
          )}
        </div>
        <p className="text-sm text-stone-600">
          累計 <span className="font-bold text-teal-600">{student.points}</span> pt ・ 連続記録 {student.streakDays} 日
        </p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-stone-700">成長の記録</h2>
        <div className="flex flex-col gap-2">
          {AVATAR_STAGES.map((s) => {
            const reached = student.points >= s.min;
            return (
              <div key={s.stage} className={`flex items-center gap-3 rounded-lg p-2 ${reached ? "bg-teal-50" : "bg-stone-50 opacity-50"}`}>
                <Avatar stage={s.stage} size={40} />
                <div>
                  <p className={`text-sm font-semibold ${reached ? "text-teal-700" : "text-stone-500"}`}>{s.name}</p>
                  <p className="text-[11px] text-stone-400">
                    {s.min}pt{s.max !== null ? `〜${s.max}pt` : "〜"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-sm font-bold text-stone-700">ポイント履歴</h2>
        {events.length === 0 ? (
          <p className="text-xs text-stone-400">まだポイント履歴がありません。</p>
        ) : (
          <ul className="flex flex-col divide-y divide-stone-100">
            {events
              .slice()
              .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
              .map((e) => (
                <li key={e.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-stone-600">{e.reason}</span>
                  <span className="font-semibold text-teal-600">+{e.amount}pt</span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
