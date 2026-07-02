"use client";

import Link from "next/link";
import { useState } from "react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { useStore } from "@/lib/store";

export function AIDialogueClient({ recordId }: { recordId: string }) {
  const { getRecord, answerDialogueRound, continueDialogue, closeDialogue } = useStore();
  const record = getRecord(recordId);
  const [thinking, setThinking] = useState<string | null>(null);

  if (!record) {
    return <p className="text-sm text-stone-400">記録が見つかりません。</p>;
  }

  const dialogue = record.aiDialogue;
  const lastRound = dialogue.rounds[dialogue.rounds.length - 1];
  const awaitingAnswer = dialogue.status === "in_progress" && lastRound.selectedIndex === null;

  function handleSelect(round: number, idx: number) {
    setThinking(round >= 5 ? "AIが対話をまとめています…" : "AIが次の質問を考えています…");
    setTimeout(() => {
      answerDialogueRound(recordId, round, idx);
      setThinking(null);
    }, 700);
  }

  function handleContinue() {
    setThinking("AIが次の質問を考えています…");
    setTimeout(() => {
      continueDialogue(recordId);
      setThinking(null);
    }, 700);
  }

  function handleClose() {
    setThinking("AIがサマリーを作成しています…");
    setTimeout(() => {
      closeDialogue(recordId);
      setThinking(null);
    }, 1000);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex items-center gap-2">
        <CategoryBadge category={record.category} />
        <h1 className="text-sm font-bold text-stone-800">{record.title}</h1>
      </div>
      <p className="text-xs text-stone-400">
        AI（Gemini）との対話 · {dialogue.rounds.filter((r) => r.selectedIndex !== null).length} / {Math.max(dialogue.rounds.length, 5)} 問
      </p>

      <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        {dialogue.rounds.map((r) => (
          <div key={r.round} className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-600">
                Q{r.round}
              </span>
              <p className="text-sm font-medium text-stone-800">{r.question}</p>
            </div>
            <div className="ml-7 flex flex-wrap gap-2">
              {r.choices.map((choice, idx) => {
                const selected = r.selectedIndex === idx;
                const disabled = r.selectedIndex !== null;
                return (
                  <button
                    key={idx}
                    disabled={disabled}
                    onClick={() => handleSelect(r.round, idx)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition ${
                      selected
                        ? "bg-teal-600 text-white ring-teal-600"
                        : disabled
                          ? "bg-stone-50 text-stone-300 ring-stone-100"
                          : "bg-white text-stone-600 ring-stone-300 hover:bg-teal-50 hover:ring-teal-300"
                    }`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-300 [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-300 [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-300" />
            {thinking}
          </div>
        )}

        {!thinking && dialogue.status === "awaiting_continue_choice" && (
          <div className="flex flex-col gap-3 rounded-xl bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-800">
              {dialogue.rounds.length}回のやり取りが完了しました。ここで終えますか？それとも、さらに深掘りしますか？
            </p>
            <div className="flex gap-2">
              <button onClick={handleClose} className="rounded-full bg-stone-800 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-900">
                ここで終える（サマリーを作成）
              </button>
              <button onClick={handleContinue} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-300 hover:bg-amber-100">
                さらに深掘りする
              </button>
            </div>
          </div>
        )}

        {!thinking && dialogue.status === "closed" && dialogue.summary && (
          <div className="flex flex-col gap-3 rounded-xl bg-teal-50 p-4">
            <p className="text-xs font-bold text-teal-700">✅ AIサマリー（教員への報告用・約400字）</p>
            <p className="text-sm leading-relaxed text-stone-700">{dialogue.summary}</p>
            <p className="text-xs text-teal-600">記録を書く・AI深掘りを完了したことでポイントが加算されました。</p>
            <div className="flex gap-2">
              <Link href={`/student/records/${record.id}`} className="rounded-full bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700">
                記録の詳細を見る
              </Link>
              <Link href="/student" className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-stone-600 ring-1 ring-inset ring-stone-300 hover:bg-stone-50">
                ダッシュボードに戻る
              </Link>
            </div>
          </div>
        )}
      </div>

      {awaitingAnswer && !thinking && (
        <p className="text-center text-xs text-stone-400">3つの選択肢から、一番近いものを選んでください</p>
      )}
    </div>
  );
}
