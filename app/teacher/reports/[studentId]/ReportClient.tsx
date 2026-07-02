"use client";

import Link from "next/link";
import { CategoryBadge } from "@/components/CategoryBadge";
import { nowDateStr } from "@/lib/now";
import { buildReportNarrative, getPeriodRange, splitBeforeAfter } from "@/lib/report";
import { useStore } from "@/lib/store";

export function ReportClient({ studentId, period }: { studentId: string; period: string }) {
  const { getStudent, getRecordsByStudent } = useStore();
  const student = getStudent(studentId);
  const allRecords = getRecordsByStudent(studentId);
  const { inRange, before, after } = splitBeforeAfter(allRecords, period);
  const range = getPeriodRange(period);
  const narrative = buildReportNarrative(studentId, period, before, after);

  if (!student) return <p className="text-sm text-stone-400">生徒が見つかりません。</p>;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div className="no-print flex items-center justify-between">
        <Link href="/teacher/reports" className="text-xs text-stone-400 hover:text-stone-600">
          ← レポート選択に戻る
        </Link>
        <button
          onClick={() => window.print()}
          className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
        >
          PDF出力（印刷ダイアログ）
        </button>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm print:rounded-none print:border-0 print:shadow-none">
        <div className="mb-6 flex items-start justify-between border-b border-stone-200 pb-4">
          <div>
            <p className="text-xs font-semibold text-stone-400">青楓館高等学院 ・ 総合コース</p>
            <h1 className="text-xl font-bold text-stone-800">探究活動 サマリーレポート</h1>
          </div>
          <p className="text-xs text-stone-400">出力日：{nowDateStr()}</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-stone-400">生徒番号</p>
            <p className="font-mono font-semibold text-stone-800">{studentId}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400">氏名（教員が対応表を用いて記入）</p>
            <div className="mt-2 h-px w-40 border-b border-dashed border-stone-400" />
          </div>
          <div>
            <p className="text-xs text-stone-400">対象期間</p>
            <p className="font-semibold text-stone-800">
              {period}（{range.start} 〜 {range.end}）
            </p>
          </div>
        </div>

        <section className="mb-6">
          <h2 className="mb-2 text-sm font-bold text-stone-700">1. 活動一覧（{inRange.length}件）</h2>
          {inRange.length === 0 ? (
            <p className="text-xs text-stone-400">対象期間内の記録はありません。</p>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400">
                  <th className="py-1.5 pr-2 font-medium">日付</th>
                  <th className="py-1.5 pr-2 font-medium">カテゴリ</th>
                  <th className="py-1.5 font-medium">タイトル</th>
                </tr>
              </thead>
              <tbody>
                {inRange.map((r) => (
                  <tr key={r.id} className="border-b border-stone-100">
                    <td className="py-1.5 pr-2 text-stone-500">{r.date}</td>
                    <td className="py-1.5 pr-2">
                      <CategoryBadge category={r.category} />
                    </td>
                    <td className="py-1.5 text-stone-700">{r.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-sm font-bold text-stone-700">2. 成長の軌跡（Before / After）</h2>
          <p className="mb-3 text-sm leading-relaxed text-stone-700">
            {narrative.overview} {narrative.change}
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="rounded-lg bg-stone-50 p-3">
              <p className="mb-1 font-semibold text-stone-500">前半（Before）・{before.length}件</p>
              <ul className="flex flex-col gap-1 text-stone-600">
                {before.map((r) => (
                  <li key={r.id}>・{r.title}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <p className="mb-1 font-semibold text-teal-700">後半（After）・{after.length}件</p>
              <ul className="flex flex-col gap-1 text-stone-600">
                {after.map((r) => (
                  <li key={r.id}>・{r.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-2">
          <h2 className="mb-2 text-sm font-bold text-stone-700">3. 総括コメント</h2>
          <p className="text-sm leading-relaxed text-stone-700">{narrative.closing}</p>
        </section>

        <p className="mt-6 border-t border-stone-100 pt-3 text-[10px] text-stone-400">
          本レポートはAI（Gemini）が活動記録とAI深掘りサマリーをもとに自動生成したものです（モックのためダミー生成ロジック）。内容は教員が確認の上、出願書類・面談資料等の下地としてご活用ください。個人情報保護のため、氏名は本システムでは保持していません。
        </p>
      </div>
    </div>
  );
}
