import { RecordDetailClient } from "./RecordDetailClient";

export default async function StudentRecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RecordDetailClient recordId={id} />;
}
