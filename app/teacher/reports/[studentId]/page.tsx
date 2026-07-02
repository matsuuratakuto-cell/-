import { ReportClient } from "./ReportClient";

export default async function TeacherReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ studentId: string }>;
  searchParams: Promise<{ period?: string }>;
}) {
  const { studentId } = await params;
  const { period } = await searchParams;
  return <ReportClient studentId={studentId} period={period ?? "1学期"} />;
}
