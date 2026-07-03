export type Category = "探究学習" | "部活動" | "修学旅行" | "ボランティア" | "その他";

export const CATEGORIES: Category[] = [
  "探究学習",
  "部活動",
  "修学旅行",
  "ボランティア",
  "その他",
];

export type Visibility = "担当教員のみ" | "コース内公開" | "非公開";

export const VISIBILITIES: Visibility[] = ["担当教員のみ", "コース内公開", "非公開"];

export interface AIDialogueRound {
  round: number;
  question: string;
  choices: string[];
  selectedIndex: number | null;
}

export interface AIDialogue {
  rounds: AIDialogueRound[];
  status: "in_progress" | "awaiting_continue_choice" | "closed";
  summary: string | null;
  completedFully: boolean;
}

export interface FeedbackEntry {
  id: string;
  teacherName: string;
  comment: string;
  createdAt: string;
}

export interface ActivityRecord {
  id: string;
  studentId: string;
  category: Category;
  title: string;
  date: string;
  content: string;
  reflection?: string;
  photos: string[];
  visibility: Visibility;
  status: "未確認" | "確認済み";
  feedback: FeedbackEntry[];
  aiDialogue: AIDialogue;
  taskId?: string;
  submittedLate?: boolean;
  createdAt: string;
}

export type Grade = 1 | 2 | 3;

export const GRADES: Grade[] = [1, 2, 3];

// 富山第一高等学校のコース構成を参考にしたコース区分（本パイロットは総合コースが対象）
export type Course = "S特別進学コース" | "特別進学コース" | "総合コース" | "美術コース";

export const COURSES: Course[] = ["S特別進学コース", "特別進学コース", "総合コース", "美術コース"];

export interface Student {
  id: string;
  displayName: string;
  grade: Grade;
  course: Course;
  className: string;
  streakDays: number;
  lastRecordDate?: string;
}

export interface Teacher {
  id: string;
  name: string;
}

export type TaskTargetType = "all" | "individual";

export interface Task {
  id: string;
  title: string;
  category: Category;
  instruction: string;
  dueAt: string;
  targetType: TaskTargetType;
  targetStudentIds: string[];
  createdAt: string;
  createdBy: string;
}
