import { StudentRecordsClient } from "./StudentRecordsClient";

export default async function TeacherStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudentRecordsClient studentId={id} />;
}
