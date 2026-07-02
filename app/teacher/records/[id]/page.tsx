import { TeacherRecordDetailClient } from "./TeacherRecordDetailClient";

export default async function TeacherRecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TeacherRecordDetailClient recordId={id} />;
}
