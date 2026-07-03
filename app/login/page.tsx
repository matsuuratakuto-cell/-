"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleIcon } from "@/components/GoogleIcon";

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "google">("idle");

  function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status !== "idle") return;
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 900);
  }

  function handleGoogleLogin() {
    if (status !== "idle") return;
    setStatus("google");
    setTimeout(() => router.push("/student-setup"), 900);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-6 py-16">
      <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-600">
        <span>青楓館高等学院</span>
        <span className="text-stone-300">/</span>
        <span>生徒ログイン</span>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-center text-lg font-bold text-stone-800">生徒ログイン</h1>
        <p className="mb-6 text-center text-xs text-stone-500">
          学校配布のメールアドレスでログインします
        </p>

        {status === "sent" ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-stone-700">
              <span className="font-semibold">{email}</span> 宛にログインリンクを送信しました（モック）
            </p>
            <button
              onClick={() => router.push("/student-setup")}
              className="w-full rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              （モック）リンクをクリックしてログイン
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSendLink} className="flex flex-col gap-3">
              <label className="block text-left text-xs font-semibold text-stone-600">
                学校配布のメールアドレス
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="s0012345@seifukan.ed.jp"
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
                />
              </label>
              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {status === "sending" ? "送信しています…" : "ログインリンクを送信する"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-stone-400">
              <div className="h-px flex-1 bg-stone-200" />
              または
              <div className="h-px flex-1 bg-stone-200" />
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={status === "google"}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
            >
              <GoogleIcon />
              {status === "google" ? "Googleでログインしています…" : "Googleでログイン"}
            </button>
          </>
        )}
      </div>

      <p className="mt-6 text-center text-[11px] text-stone-400">
        ※ このログイン画面はUIモックです。実際の認証・アカウント連携はまだ行われません。
      </p>
      <Link href="/" className="mt-3 text-xs text-stone-400 underline decoration-dotted hover:text-stone-600">
        ← モックTOPに戻る
      </Link>
    </main>
  );
}
