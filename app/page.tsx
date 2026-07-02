"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { useStore } from "@/lib/store";

export default function Home() {
  const { resetMockData } = useStore();
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-600">
        <span>青楓館高等学院</span>
        <span className="text-stone-300">/</span>
        <span>UIモック（Supabase連携・ログイン機能なし）</span>
      </div>
      <h1 className="mb-3 text-center text-2xl font-bold text-stone-800 sm:text-3xl">
        探究活動記録・分析システム
      </h1>
      <p className="mb-10 max-w-xl text-center text-sm leading-relaxed text-stone-500">
        総合コースのパイロット運用を想定したモックです。ダミーデータのみを使用し、ログイン・DB連携は行いません。ロールを選んで画面遷移を確認してください。
      </p>

      <div className="grid w-full gap-6 sm:grid-cols-2">
        <Link
          href="/student"
          className="group flex flex-col items-center gap-4 rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <Avatar stage={3} size={100} />
          <div>
            <div className="text-lg font-semibold text-stone-800 group-hover:text-teal-700">
              生徒として見る
            </div>
            <p className="mt-1 text-xs text-stone-500">
              活動記録の入力、AI深掘り対話、動物アバターの育成
            </p>
          </div>
        </Link>

        <Link
          href="/teacher"
          className="group flex flex-col items-center gap-4 rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-indigo-50 text-4xl">
            🧑‍🏫
          </div>
          <div>
            <div className="text-lg font-semibold text-stone-800 group-hover:text-indigo-700">
              教員として見る
            </div>
            <p className="mt-1 text-xs text-stone-500">
              記録の確認・フィードバック、タスク発行、サマリーレポート出力
            </p>
          </div>
        </Link>
      </div>

      {confirmingReset ? (
        <div className="mt-10 flex items-center gap-3 text-xs text-stone-500">
          <span>モックデータを初期状態に戻します。よろしいですか？</span>
          <button
            onClick={() => {
              resetMockData();
              setConfirmingReset(false);
            }}
            className="rounded-full bg-rose-600 px-3 py-1 font-semibold text-white hover:bg-rose-700"
          >
            リセットする
          </button>
          <button
            onClick={() => setConfirmingReset(false)}
            className="rounded-full border border-stone-300 px-3 py-1 text-stone-500 hover:bg-stone-100"
          >
            キャンセル
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirmingReset(true)}
          className="mt-10 text-xs text-stone-400 underline decoration-dotted hover:text-stone-600"
        >
          モックデータを初期状態にリセットする
        </button>
      )}
    </main>
  );
}
