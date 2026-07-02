import { AIDialogueRound, ActivityRecord } from "./types";

// モック用のサマリー生成。実際にはGemini APIが対話全体を読み取り約400字に要約する想定。
// ここでは選択された回答テキストをテンプレートに流し込み、それらしい振り返り文章を組み立てる。
export function buildAISummary(
  record: Pick<ActivityRecord, "category" | "title">,
  rounds: AIDialogueRound[]
): string {
  const chosen = rounds
    .filter((r) => r.selectedIndex !== null)
    .map((r) => r.choices[r.selectedIndex as number]);

  const c = (i: number, fallback: string) => chosen[i] ?? fallback;

  const parts: string[] = [];
  parts.push(
    `「${record.title}」（${record.category}）についての対話では、まず${c(
      0,
      "活動の中で印象に残った出来事"
    )}をきっかけに振り返りが始まった。`
  );
  parts.push(
    `その背景を掘り下げると、${c(1, "自分の準備や視点に課題があったこと")}に気づき、次に活かす工夫として${c(
      2,
      "事前の準備を見直すこと"
    )}を挙げた。`
  );
  parts.push(
    `また、${c(3, "自分の得意なこと")}との結びつきにも言及し、今回の経験を一言で表すと「${c(
      4,
      "挑戦"
    )}」であるとまとめた。`
  );
  if (chosen[5]) {
    parts.push(`進路とのつながりについては、${chosen[5]}という考えに至った。`);
  }
  if (chosen[6]) {
    parts.push(`周囲との関わりについては、${chosen[6]}という振り返りがあった。`);
  }
  if (chosen[7]) {
    parts.push(`最後に、今回最も成長したと感じる部分として${chosen[7]}を挙げている。`);
  }
  parts.push(
    "表層的な感想にとどまらず、原因の分析と次の行動への意識づけまで踏み込めた対話となった。"
  );

  let summary = parts.join("");
  if (summary.length > 430) {
    summary = summary.slice(0, 427) + "…";
  }
  return summary;
}
