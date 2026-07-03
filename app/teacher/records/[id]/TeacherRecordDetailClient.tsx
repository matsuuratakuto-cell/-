"use client";

import Link from "next/link";
import { useState } from "react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { LateBadge, StatusBadge } from "@/components/StatusBadge";
import { useStore } from "@/lib/store";

export function TeacherRecordDetailClient({ recordId }: { recordId: string }) {
  const { getRecord, currentTeacherId, teachers, addFeedback, setRecordStatus } = useStore();
  const record = getRecord(recordId);
  const [comment, setComment] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);

  if (!record) return <p className="text-sm text-stone-400">記録が見つかりません。</p>;

  const teacherName = teachers.find((t) => t.id === currentTeacherId)?.name ?? "";

  function handleSubmitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    addFeedback(recordId, teacherName, comment.trim());
    setComment("");
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <Link href={`/teacher/students/${record.studentId}`} className="text-xs text-stone-400 hover:text-stone-600">
        ← {record.studentId} の記録一覧に戻る
      </Link>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={record.category} />
            <StatusBadge status={record.status} />
            {record.submittedLate && <LateBadge />}
          </div>
          <button
            onClick={() => setRecordStatus(recordId, record.status === "未確認" ? "確認済み" : "未確認")}
            className="rounded-full border border-stone-300 px-3 py-1 text-xs font-medium text-stone-600 hover:bg-stone-100"
          >
            {record.status === "未確認" ? "確認済みにする" : "未確認に戻す"}
          </button>
        </div>
        <h1 className="mb-1 text-lg font-bold text-stone-800">{record.title}</h1>
        <p className="mb-4 text-xs text-stone-400">
          {record.studentId} ・ {record.date} ・ 公開範囲：{record.visibility}
        </p>
        <div className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{record.content}</div>
        {record.reflection && (
          <div className="mb-4 rounded-lg bg-stone-50 p-3">
            <p className="mb-1 text-xs font-semibold text-stone-500">振り返り</p>
            <p className="whitespace-pre-wrap text-sm text-stone-700">{record.reflection}</p>
          </div>
        )}
        {record.photos.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {record.photos.map((p) => (
              <span key={p} className="rounded-md bg-stone-100 px-2 py-1 text-xs text-stone-500">
                📎 {p}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-700">AI深掘りサマリー</h2>
          {record.aiDialogue.rounds.length > 0 && (
            <button onClick={() => setShowTranscript((v) => !v)} className="text-xs font-semibold text-brand-600 hover:underline">
              {showTranscript ? "対話全文を隠す" : "対話全文を見る"}
            </button>
          )}
        </div>
        {record.aiDialogue.status === "closed" && record.aiDialogue.summary ? (
          <p className="text-sm leading-relaxed text-stone-700">{record.aiDialogue.summary}</p>
        ) : (
          <p className="text-xs text-stone-400">
            {record.aiDialogue.status === "awaiting_continue_choice" ? "生徒の継続選択待ちです。" : "対話がまだ完了していません。"}
          </p>
        )}
        {showTranscript && (
          <div className="mt-4 flex flex-col gap-3 border-t border-stone-100 pt-4">
            {record.aiDialogue.rounds.map((r) => (
              <div key={r.round} className="text-xs">
                <p className="font-semibold text-stone-600">
                  Q{r.round}. {r.question}
                </p>
                <p className="mt-0.5 text-stone-500">
                  {r.selectedIndex !== null ? `→ ${r.choices[r.selectedIndex]}` : "（未回答）"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-sm font-bold text-stone-700">フィードバック</h2>
        <ul className="mb-4 flex flex-col gap-3">
          {record.feedback.map((f) => (
            <li key={f.id} className="rounded-lg bg-brand-50 p-3">
              <p className="mb-1 text-xs font-semibold text-brand-700">{f.teacherName}</p>
              <p className="text-sm text-stone-700">{f.comment}</p>
              <p className="mt-1 text-[10px] text-stone-400">{f.createdAt.replace("T", " ")}</p>
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmitFeedback} className="flex flex-col gap-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder={`${teacherName} としてコメントを入力`}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            className="self-start rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-40"
          >
            フィードバックを送信
          </button>
        </form>
      </div>
    </div>
  );
}
