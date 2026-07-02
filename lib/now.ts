// モックのデモ日時を固定し、要件定義書の日付感（2026年7月2日）と齟齬が出ないようにする。
// 日付計算はすべてUTC基準で行い、実行環境のタイムゾーンによって日付がずれないようにする。
export const MOCK_NOW = new Date("2026-07-02T09:00:00Z");

export function nowISO(): string {
  return MOCK_NOW.toISOString().slice(0, 16);
}

export function nowDateStr(): string {
  return MOCK_NOW.toISOString().slice(0, 10);
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function isConsecutiveDay(prevDateStr: string, nextDateStr: string): boolean {
  return addDays(prevDateStr, 1) === nextDateStr;
}
