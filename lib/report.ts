import { ActivityRecord, Category } from "./types";

export const PERIOD_RANGES: Record<string, { start: string; end: string }> = {
  "1学期": { start: "2026-04-01", end: "2026-07-20" },
  "2学期": { start: "2026-09-01", end: "2026-12-20" },
  "3学期": { start: "2027-01-08", end: "2027-03-20" },
  通年: { start: "2026-04-01", end: "2027-03-20" },
};

export function getPeriodRange(period: string) {
  return PERIOD_RANGES[period] ?? PERIOD_RANGES["通年"];
}

export function splitBeforeAfter(records: ActivityRecord[], period: string) {
  const { start, end } = getPeriodRange(period);
  const inRange = records
    .filter((r) => r.date >= start && r.date <= end)
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  const midMs = startMs + (endMs - startMs) / 2;

  const before = inRange.filter((r) => new Date(r.date).getTime() <= midMs);
  const after = inRange.filter((r) => new Date(r.date).getTime() > midMs);
  return { inRange, before, after };
}

function categoryBreakdown(records: ActivityRecord[]): string {
  const counts = new Map<Category, number>();
  records.forEach((r) => counts.set(r.category, (counts.get(r.category) ?? 0) + 1));
  return Array.from(counts.entries())
    .map(([c, n]) => `${c}${n}件`)
    .join("、");
}

export function buildReportNarrative(
  studentId: string,
  period: string,
  before: ActivityRecord[],
  after: ActivityRecord[]
): { overview: string; change: string; closing: string } {
  const overview =
    before.length + after.length === 0
      ? `${studentId}について、${period}の対象期間内に記録された活動はありませんでした。`
      : `${studentId}は${period}の期間に、前半${before.length}件（${categoryBreakdown(before) || "記録なし"}）、後半${after.length}件（${categoryBreakdown(after) || "記録なし"}）の活動記録を残した。`;

  const beforeSample = before.find((r) => r.aiDialogue.summary)?.aiDialogue.summary;
  const afterSample = after.find((r) => r.aiDialogue.summary)?.aiDialogue.summary;

  let change: string;
  if (beforeSample && afterSample) {
    change = `前半は「${beforeSample.slice(0, 60)}…」といった振り返りが中心だったのに対し、後半になると「${afterSample.slice(
      0,
      60
    )}…」というように、気づきを次の行動につなげる視点がより具体的になっている。`;
  } else if (afterSample) {
    change = `後半の記録では「${afterSample.slice(0, 80)}…」といった振り返りが見られ、活動を通じた気づきの言語化が進んでいる。`;
  } else if (beforeSample) {
    change = `前半の記録では「${beforeSample.slice(0, 80)}…」といった振り返りが見られた。後半のデータが揃うことで、より明確な変化が見えてくると考えられる。`;
  } else {
    change = "対象期間内のデータが少ないため、変化の傾向を示すには至っていない。";
  }

  const closing =
    before.length + after.length > 0
      ? `全体を通じて、単発の感想にとどまらず、AIとの対話を通じた振り返りの積み重ねが見られる。今後は${
          after.length >= before.length ? "この勢いを維持しながら" : "記録の頻度を上げながら"
        }、探究の深まりを継続的に記録していくことが期待される。`
      : "今後、対象期間内に記録が蓄積されることで、成長の軌跡を可視化できるようになる見込みである。";

  return { overview, change, closing };
}
