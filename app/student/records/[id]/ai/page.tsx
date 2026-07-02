import { AIDialogueClient } from "./AIDialogueClient";

export default async function AIDialoguePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AIDialogueClient recordId={id} />;
}
