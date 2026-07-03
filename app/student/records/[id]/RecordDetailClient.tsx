"use client";

import Link from "next/link";
import { useState } from "react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { LateBadge, StatusBadge } from "@/components/StatusBadge";
import { useStore } from "@/lib/store";

export function RecordDetailClient({ recordId }: { recordId: string }) {
  const { getRecord, updateAISummary } = useStore();
  const record = getRecord(recordId);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  if (!record) {
    return <p className="text-sm text-stone-400">記録が見つかりません。</p>;
  }

  const dialogueDone = record.aiDialogue.status === "closed";
  const canEditSummary = dialogueDone && record.status === "未確認";

  function startEditing() {
    setDraft(record!.aiDialogue.summary ?? "");
    setEditing(true);
  }

  function handleSave() {
    updateAISummary(recordId, draft.trim());
    setEditing(false);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <Link href="/student/records" className="text-xs text-stone-400 hover:text-stone-600">
        ← 記録一覧に戻る
      </Link>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <CategoryBadge category={record.category} />
          <StatusBadge status={record.status} />
          {record.submittedLate && <LateBadge />}
        </div>
        <h1 className="mb-1 text-lg font-bold text-stone-800">{record.title}</h1>
        <p className="mb-4 text-xs text-stone-400">
          {record.date} ・ 公開範囲：{record.visibility}
        </p>

        <div className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{record.content}</div>

        {record.reflection && (
          <div className="mb-4 rounded-lg bg-stone-50 p-3">
            <p className="mb-1 text-xs font-semibold text-stone-500">振り返り</p>
            <p className="whitespace-pre-wrap text-sm text-stone-700">{record.reflection}</p>
          </div>
        )}

        {record.photos.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
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
          <h2 className="text-sm font-bold text-stone-700">AI深掘り対話</h2>
          <Link href={`/student/records/${record.id}/ai`} className="text-xs font-semibold text-brand-600 hover:underline">
            {dialogueDone ? "対話を振り返る →" : "対話を続ける →"}
          </Link>
        </div>
        {dialogueDone && record.aiDialogue.summary ? (
          editing ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-stone-300 p-3 text-sm leading-relaxed text-stone-700"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="rounded-full bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                >
                  保存する
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="rounded-full border border-stone-300 px-4 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-sm leading-relaxed text-stone-700">{record.aiDialogue.summary}</p>
              {canEditSummary ? (
                <button onClick={startEditing} className="self-start text-xs font-semibold text-brand-600 hover:underline">
                  サマリーを編集する
                </button>
              ) : (
                <p className="text-[11px] text-stone-400">
                  ※ 教員が確認済みにした記録のサマリーは編集できません。
                </p>
              )}
            </div>
          )
        ) : (
          <p className="text-xs text-stone-400">
            {record.aiDialogue.status === "awaiting_continue_choice"
              ? "5回のやり取りが完了しています。続けるか終えるか選択してください。"
              : "AIとの対話がまだ完了していません。"}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-sm font-bold text-stone-700">教員からのフィードバック</h2>
        {record.feedback.length === 0 ? (
          <p className="text-xs text-stone-400">まだフィードバックはありません。</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {record.feedback.map((f) => (
              <li key={f.id} className="rounded-lg bg-brand-50 p-3">
                <p className="mb-1 text-xs font-semibold text-brand-700">{f.teacherName}</p>
                <p className="text-sm text-stone-700">{f.comment}</p>
                <p className="mt-1 text-[10px] text-stone-400">{f.createdAt.replace("T", " ")}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
