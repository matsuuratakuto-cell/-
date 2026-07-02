export interface AvatarStageInfo {
  stage: number;
  name: string;
  min: number;
  max: number | null;
  description: string;
}

export const AVATAR_STAGES: AvatarStageInfo[] = [
  { stage: 1, name: "たまご", min: 0, max: 29, description: "まだ何も始まっていない、静かなたまごの時期。" },
  { stage: 2, name: "子ギツネ", min: 30, max: 79, description: "殻を破って顔を出したばかり。記録の習慣がつき始めた証。" },
  { stage: 3, name: "わんぱくギツネ", min: 80, max: 159, description: "元気いっぱいに動き回る成長期。振り返りの質も上がってきた。" },
  { stage: 4, name: "たのもしいギツネ", min: 160, max: 299, description: "落ち着きと風格が出てきた頼れる相棒。" },
  { stage: 5, name: "伝説のキツネ", min: 300, max: null, description: "数えきれない記録と対話を重ねた証。金色に輝く尻尾を持つ。" },
];

export function getAvatarStage(points: number): AvatarStageInfo {
  return (
    AVATAR_STAGES.find((s) => points >= s.min && (s.max === null || points <= s.max)) ??
    AVATAR_STAGES[AVATAR_STAGES.length - 1]
  );
}

export function getNextStage(points: number): AvatarStageInfo | null {
  const current = getAvatarStage(points);
  const idx = AVATAR_STAGES.findIndex((s) => s.stage === current.stage);
  return idx >= 0 && idx < AVATAR_STAGES.length - 1 ? AVATAR_STAGES[idx + 1] : null;
}

export function progressToNextStage(points: number): number {
  const current = getAvatarStage(points);
  if (current.max === null) return 100;
  const span = current.max - current.min + 1;
  const gained = points - current.min;
  return Math.min(100, Math.round((gained / span) * 100));
}
