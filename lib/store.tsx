"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getQuestionForRound } from "./aiQuestions";
import { buildAISummary } from "./aiSummary";
import { newId } from "./id";
import {
  INITIAL_RECORDS,
  INITIAL_STUDENTS,
  INITIAL_TASKS,
  NAME_MAPPING,
  TEACHERS,
  TEACHER_ASSIGNMENTS,
} from "./mockData";
import { addDays, isConsecutiveDay, nowISO } from "./now";
import {
  ActivityRecord,
  Category,
  Course,
  Grade,
  Student,
  Task,
  TaskTargetType,
  Visibility,
} from "./types";

const STORAGE_KEY = "seifukan-portfolio-mock-v1";

interface PersistedState {
  students: Student[];
  records: ActivityRecord[];
  tasks: Task[];
  currentTeacherId: string;
  currentStudentId: string;
  reminders: ReminderLog[];
}

interface ReminderLog {
  taskId: string;
  studentId: string;
  at: string;
}

function seedState(): PersistedState {
  return {
    students: INITIAL_STUDENTS,
    records: INITIAL_RECORDS,
    tasks: INITIAL_TASKS,
    currentTeacherId: TEACHERS[0].id,
    currentStudentId: INITIAL_STUDENTS[0].id,
    reminders: [],
  };
}

export interface NewRecordInput {
  studentId: string;
  category: Category;
  title: string;
  date: string;
  content: string;
  reflection?: string;
  photos: string[];
  visibility: Visibility;
  taskId?: string;
}

export interface NewTaskInput {
  title: string;
  category: Category;
  instruction: string;
  dueAt: string;
  targetType: TaskTargetType;
  targetStudentIds: string[];
  createdBy: string;
}

interface StoreValue extends PersistedState {
  ready: boolean;
  teachers: typeof TEACHERS;
  teacherAssignments: typeof TEACHER_ASSIGNMENTS;
  nameMapping: typeof NAME_MAPPING;
  setCurrentTeacherId: (id: string) => void;
  setCurrentStudentId: (id: string) => void;
  updateStudentProfile: (studentId: string, profile: { grade: Grade; course: Course; className: string }) => void;
  getStudent: (id: string) => Student | undefined;
  getRecord: (id: string) => ActivityRecord | undefined;
  getRecordsByStudent: (id: string) => ActivityRecord[];
  getSubmissionForTask: (taskId: string, studentId: string) => ActivityRecord | undefined;
  getTasksForStudent: (studentId: string) => Task[];
  getOpenTasksForStudent: (studentId: string) => Task[];
  addRecord: (input: NewRecordInput) => ActivityRecord;
  answerDialogueRound: (recordId: string, round: number, selectedIndex: number) => void;
  continueDialogue: (recordId: string) => void;
  closeDialogue: (recordId: string) => void;
  updateAISummary: (recordId: string, summary: string) => void;
  addFeedback: (recordId: string, teacherName: string, comment: string) => void;
  setRecordStatus: (recordId: string, status: "未確認" | "確認済み") => void;
  addTask: (input: NewTaskInput) => Task;
  remindStudent: (taskId: string, studentId: string) => void;
  wasReminded: (taskId: string, studentId: string) => boolean;
  resetMockData: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setState(JSON.parse(raw));
        return;
      }
    } catch {
      // ignore parse errors, fall through to seed
    }
    setState(seedState());
  }, []);

  useEffect(() => {
    if (state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const value = useMemo<StoreValue | null>(() => {
    if (!state) return null;

    const getStudent = (id: string) => state.students.find((s) => s.id === id);
    const getRecord = (id: string) => state.records.find((r) => r.id === id);
    const getRecordsByStudent = (id: string) =>
      state.records
        .filter((r) => r.studentId === id)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const getSubmissionForTask = (taskId: string, studentId: string) =>
      state.records.find((r) => r.taskId === taskId && r.studentId === studentId);
    const getTasksForStudent = (studentId: string) =>
      state.tasks.filter((t) => t.targetType === "all" || t.targetStudentIds.includes(studentId));
    const getOpenTasksForStudent = (studentId: string) =>
      getTasksForStudent(studentId).filter((t) => !getSubmissionForTask(t.id, studentId));

    const addRecord: StoreValue["addRecord"] = (input) => {
      const recordId = newId("R");
      const firstQ = getQuestionForRound(1);
      const createdAt = nowISO();

      const student = state.students.find((s) => s.id === input.studentId);
      let streakDays = 1;
      if (student?.lastRecordDate === input.date) {
        streakDays = student.streakDays;
      } else if (student?.lastRecordDate && isConsecutiveDay(student.lastRecordDate, input.date)) {
        streakDays = student.streakDays + 1;
      }

      let submittedLate: boolean | undefined;
      const task = input.taskId ? state.tasks.find((t) => t.id === input.taskId) : undefined;
      if (task) {
        submittedLate = new Date(createdAt) > new Date(task.dueAt);
      }

      const newRecord: ActivityRecord = {
        id: recordId,
        studentId: input.studentId,
        category: input.category,
        title: input.title,
        date: input.date,
        content: input.content,
        reflection: input.reflection,
        photos: input.photos,
        visibility: input.visibility,
        status: "未確認",
        feedback: [],
        aiDialogue: {
          rounds: [
            { round: 1, question: firstQ.question, choices: firstQ.choices, selectedIndex: null },
          ],
          status: "in_progress",
          completedFully: false,
          summary: null,
        },
        taskId: input.taskId,
        submittedLate,
        createdAt,
      };

      setState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          records: [newRecord, ...prev.records],
          students: prev.students.map((s) =>
            s.id === input.studentId ? { ...s, streakDays, lastRecordDate: input.date } : s
          ),
        };
      });

      return newRecord;
    };

    const answerDialogueRound: StoreValue["answerDialogueRound"] = (recordId, round, selectedIndex) => {
      setState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          records: prev.records.map((r) => {
            if (r.id !== recordId) return r;
            const rounds = r.aiDialogue.rounds.map((rd) =>
              rd.round === round ? { ...rd, selectedIndex } : rd
            );
            if (round >= 5) {
              return { ...r, aiDialogue: { ...r.aiDialogue, rounds, status: "awaiting_continue_choice" } };
            }
            const nextQ = getQuestionForRound(round + 1);
            rounds.push({ round: round + 1, question: nextQ.question, choices: nextQ.choices, selectedIndex: null });
            return { ...r, aiDialogue: { ...r.aiDialogue, rounds, status: "in_progress" } };
          }),
        };
      });
    };

    const continueDialogue: StoreValue["continueDialogue"] = (recordId) => {
      setState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          records: prev.records.map((r) => {
            if (r.id !== recordId) return r;
            const nextRoundNum = r.aiDialogue.rounds.length + 1;
            const nextQ = getQuestionForRound(nextRoundNum);
            const rounds = [
              ...r.aiDialogue.rounds,
              { round: nextRoundNum, question: nextQ.question, choices: nextQ.choices, selectedIndex: null },
            ];
            return { ...r, aiDialogue: { ...r.aiDialogue, rounds, status: "in_progress" } };
          }),
        };
      });
    };

    const closeDialogue: StoreValue["closeDialogue"] = (recordId) => {
      const record = state.records.find((r) => r.id === recordId);
      if (!record) return;
      const summary = buildAISummary({ category: record.category, title: record.title }, record.aiDialogue.rounds);
      setState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          records: prev.records.map((r) =>
            r.id === recordId
              ? { ...r, aiDialogue: { ...r.aiDialogue, status: "closed", completedFully: true, summary } }
              : r
          ),
        };
      });
    };

    const updateAISummary: StoreValue["updateAISummary"] = (recordId, summary) => {
      const record = state.records.find((r) => r.id === recordId);
      if (!record) return;
      if (record.status !== "未確認") {
        throw new Error("教員が確認済みにした記録のサマリーは編集できません");
      }
      if (record.aiDialogue.status !== "closed") {
        throw new Error("AI対話が完了していない記録のサマリーは編集できません");
      }
      setState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          records: prev.records.map((r) =>
            r.id === recordId ? { ...r, aiDialogue: { ...r.aiDialogue, summary } } : r
          ),
        };
      });
    };

    const addFeedback: StoreValue["addFeedback"] = (recordId, teacherName, comment) => {
      setState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          records: prev.records.map((r) =>
            r.id === recordId
              ? {
                  ...r,
                  status: "確認済み",
                  feedback: [
                    ...r.feedback,
                    { id: newId("F"), teacherName, comment, createdAt: nowISO() },
                  ],
                }
              : r
          ),
        };
      });
    };

    const setRecordStatus: StoreValue["setRecordStatus"] = (recordId, status) => {
      setState((prev) => {
        if (!prev) return prev;
        return { ...prev, records: prev.records.map((r) => (r.id === recordId ? { ...r, status } : r)) };
      });
    };

    const addTask: StoreValue["addTask"] = (input) => {
      const task: Task = { ...input, id: newId("TASK"), createdAt: nowISO() };
      setState((prev) => (prev ? { ...prev, tasks: [task, ...prev.tasks] } : prev));
      return task;
    };

    const remindStudent: StoreValue["remindStudent"] = (taskId, studentId) => {
      setState((prev) =>
        prev
          ? { ...prev, reminders: [...prev.reminders, { taskId, studentId, at: nowISO() }] }
          : prev
      );
    };

    const wasReminded: StoreValue["wasReminded"] = (taskId, studentId) =>
      state.reminders.some((r) => r.taskId === taskId && r.studentId === studentId);

    const resetMockData = () => setState(seedState());

    return {
      ...state,
      ready: true,
      teachers: TEACHERS,
      teacherAssignments: TEACHER_ASSIGNMENTS,
      nameMapping: NAME_MAPPING,
      setCurrentTeacherId: (id) => setState((prev) => (prev ? { ...prev, currentTeacherId: id } : prev)),
      setCurrentStudentId: (id) => setState((prev) => (prev ? { ...prev, currentStudentId: id } : prev)),
      updateStudentProfile: (studentId, profile) =>
        setState((prev) =>
          prev
            ? {
                ...prev,
                students: prev.students.map((s) => (s.id === studentId ? { ...s, ...profile } : s)),
              }
            : prev
        ),
      getStudent,
      getRecord,
      getRecordsByStudent,
      getSubmissionForTask,
      getTasksForStudent,
      getOpenTasksForStudent,
      addRecord,
      answerDialogueRound,
      continueDialogue,
      closeDialogue,
      updateAISummary,
      addFeedback,
      setRecordStatus,
      addTask,
      remindStudent,
      wasReminded,
      resetMockData,
    };
  }, [state]);

  if (!value) {
    return (
      <div className="flex min-h-screen items-center justify-center text-stone-400 text-sm">
        読み込み中…
      </div>
    );
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export { addDays };
