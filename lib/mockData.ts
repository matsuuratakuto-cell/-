import { getQuestionForRound } from "./aiQuestions";
import { buildAISummary } from "./aiSummary";
import {
  ActivityRecord,
  AIDialogue,
  AIDialogueRound,
  Category,
  PointEvent,
  Student,
  Task,
  Teacher,
} from "./types";

export const TEACHERS: Teacher[] = [
  { id: "T-001", name: "佐藤 先生" },
  { id: "T-002", name: "鈴木 先生" },
];

// 教員の「担当生徒」割り当て（モック用）
export const TEACHER_ASSIGNMENTS: Record<string, string[]> = {
  "T-001": ["S-001", "S-002", "S-003"],
  "T-002": ["S-004", "S-005"],
};

// システムはこの対応表を保持しない。校内で別管理される想定のデモ表示用データ。
export const NAME_MAPPING: Record<string, string> = {
  "S-001": "山田 陽菜",
  "S-002": "高橋 蓮",
  "S-003": "中村 美咲",
  "S-004": "田中 悠斗",
  "S-005": "小林 さくら",
};

function makeRounds(selections: number[]): AIDialogueRound[] {
  return selections.map((sel, i) => {
    const q = getQuestionForRound(i + 1);
    return { round: i + 1, question: q.question, choices: q.choices, selectedIndex: sel };
  });
}

function closedDialogue(category: Category, title: string, selections: number[]): AIDialogue {
  const rounds = makeRounds(selections);
  return {
    rounds,
    status: "closed",
    completedFully: true,
    summary: buildAISummary({ category, title }, rounds),
  };
}

function inProgressDialogue(selections: (number | null)[]): AIDialogue {
  const rounds = selections.map((sel, i) => {
    const q = getQuestionForRound(i + 1);
    return { round: i + 1, question: q.question, choices: q.choices, selectedIndex: sel };
  });
  return { rounds, status: "in_progress", completedFully: false, summary: null };
}

function awaitingChoiceDialogue(selections: number[]): AIDialogue {
  const rounds = makeRounds(selections);
  return { rounds, status: "awaiting_continue_choice", completedFully: false, summary: null };
}

export const INITIAL_TASKS: Task[] = [
  {
    id: "TASK-001",
    title: "1学期 探究中間ふりかえり",
    category: "探究学習",
    instruction:
      "現在のテーマ設定と、ここまでの調査で分かったこと・困っていることを記録してください。",
    dueAt: "2026-07-05T23:59",
    targetType: "all",
    targetStudentIds: [],
    createdAt: "2026-06-25T09:00",
    createdBy: "T-001",
  },
  {
    id: "TASK-002",
    title: "修学旅行 事後レポート",
    category: "修学旅行",
    instruction: "旅行先で学んだことを、事前の予想と比較してまとめてください。",
    dueAt: "2026-06-20T23:59",
    targetType: "individual",
    targetStudentIds: ["S-002", "S-003", "S-004"],
    createdAt: "2026-06-10T09:00",
    createdBy: "T-002",
  },
];

export const INITIAL_RECORDS: ActivityRecord[] = [
  {
    id: "R-0001",
    studentId: "S-001",
    category: "探究学習",
    title: "商店街の空き家調査",
    date: "2026-06-15",
    content:
      "地元商店街を歩き、空き家・空き店舗の数を数えた。あわせて店主3名にインタビューを実施。",
    reflection: "インタビューで聞いた話が事前に調べた資料の内容と全然違っていて戸惑った。",
    photos: ["survey_photo1.jpg"],
    visibility: "担当教員のみ",
    status: "確認済み",
    feedback: [
      {
        id: "F-0001",
        teacherName: "佐藤 先生",
        comment:
          "インタビューでの気づきをしっかり言語化できていますね。次は数値データとも突き合わせて、資料との違いがなぜ生まれたのか考えてみましょう。",
        createdAt: "2026-06-16T10:20",
      },
    ],
    aiDialogue: closedDialogue("探究学習", "商店街の空き家調査", [0, 2, 1, 0, 2]),
    createdAt: "2026-06-15T18:40",
  },
  {
    id: "R-0002",
    studentId: "S-001",
    category: "探究学習",
    title: "先行研究レビュー：空き家対策の事例",
    date: "2026-06-22",
    content: "他自治体の空き家対策事例を3件調べ、自分の地域に応用できそうな点をまとめた。",
    photos: [],
    visibility: "担当教員のみ",
    status: "未確認",
    feedback: [],
    aiDialogue: closedDialogue("探究学習", "先行研究レビュー：空き家対策の事例", [1, 1, 0, 2, 0]),
    createdAt: "2026-06-22T19:05",
  },
  {
    id: "R-0003",
    studentId: "S-001",
    category: "探究学習",
    title: "1学期 探究中間ふりかえり",
    date: "2026-07-01",
    content:
      "テーマは「地域商店街の空き家問題」。ここまでフィールド調査と先行研究レビューを終え、今は仮説の整理に取り組んでいる。",
    reflection: "データの整理の仕方に迷っている。",
    photos: [],
    visibility: "担当教員のみ",
    status: "未確認",
    feedback: [],
    aiDialogue: closedDialogue("探究学習", "1学期 探究中間ふりかえり", [2, 0, 1, 1, 2]),
    taskId: "TASK-001",
    submittedLate: false,
    createdAt: "2026-07-01T21:10",
  },
  {
    id: "R-0004",
    studentId: "S-002",
    category: "部活動",
    title: "バスケ部 県大会予選レポート",
    date: "2026-06-18",
    content: "県大会予選1回戦。第4クォーターで逆転されて敗退。自分のミスからの失点が響いた。",
    reflection: "終盤の集中力が課題だと感じた。",
    photos: ["game_photo.jpg"],
    visibility: "担当教員のみ",
    status: "確認済み",
    feedback: [
      {
        id: "F-0002",
        teacherName: "佐藤 先生",
        comment: "悔しい経験をきちんと分析できています。次の練習でどう活かすか一緒に考えましょう。",
        createdAt: "2026-06-19T08:30",
      },
    ],
    aiDialogue: closedDialogue("部活動", "バスケ部 県大会予選レポート", [0, 0, 2, 1, 0]),
    createdAt: "2026-06-18T20:15",
  },
  {
    id: "R-0005",
    studentId: "S-002",
    category: "部活動",
    title: "夏合宿での目標設定",
    date: "2026-06-30",
    content: "夏合宿前に、個人目標として「終盤でも集中を切らさない」ことを掲げた。",
    photos: [],
    visibility: "担当教員のみ",
    status: "未確認",
    feedback: [],
    aiDialogue: inProgressDialogue([0, 2, 1, null, null]),
    createdAt: "2026-06-30T17:50",
  },
  {
    id: "R-0006",
    studentId: "S-002",
    category: "修学旅行",
    title: "修学旅行 事後レポート（京都・奈良）",
    date: "2026-06-19",
    content: "事前学習では寺社仏閣の歴史を調べていたが、実際に訪れると職人技術の継承の話が印象的だった。",
    reflection: "予想していた内容と実際の学びの方向がずれていて面白かった。",
    photos: ["kyoto1.jpg", "nara1.jpg"],
    visibility: "担当教員のみ",
    status: "確認済み",
    feedback: [
      {
        id: "F-0003",
        teacherName: "鈴木 先生",
        comment: "事前の予想とのギャップに着目できているのが良いですね。",
        createdAt: "2026-06-20T09:00",
      },
    ],
    aiDialogue: closedDialogue("修学旅行", "修学旅行 事後レポート（京都・奈良）", [1, 0, 2, 0, 1]),
    taskId: "TASK-002",
    submittedLate: false,
    createdAt: "2026-06-19T22:00",
  },
  {
    id: "R-0007",
    studentId: "S-002",
    category: "探究学習",
    title: "1学期 探究中間ふりかえり",
    date: "2026-07-02",
    content: "テーマ「バスケットボールにおけるメンタルと集中力の関係」。文献調査を開始したところ。",
    photos: [],
    visibility: "担当教員のみ",
    status: "未確認",
    feedback: [],
    aiDialogue: closedDialogue("探究学習", "1学期 探究中間ふりかえり", [0, 1, 2, 2, 0]),
    taskId: "TASK-001",
    submittedLate: false,
    createdAt: "2026-07-02T07:40",
  },
  {
    id: "R-0008",
    studentId: "S-003",
    category: "修学旅行",
    title: "修学旅行 事後レポート（京都・奈良）",
    date: "2026-06-24",
    content: "班別行動で訪れた工房での体験が心に残った。提出が遅れてしまった。",
    reflection: "まとめるのに時間がかかってしまった。",
    photos: [],
    visibility: "担当教員のみ",
    status: "未確認",
    feedback: [],
    aiDialogue: closedDialogue("修学旅行", "修学旅行 事後レポート（京都・奈良）", [2, 1, 0, 1, 2]),
    taskId: "TASK-002",
    submittedLate: true,
    createdAt: "2026-06-24T23:30",
  },
  {
    id: "R-0009",
    studentId: "S-003",
    category: "ボランティア",
    title: "地域清掃活動に参加",
    date: "2026-06-05",
    content: "地域の河川清掃ボランティアに参加。ゴミの分別ルールが場所によって違うことに気づいた。",
    photos: ["cleanup.jpg"],
    visibility: "担当教員のみ",
    status: "確認済み",
    feedback: [
      {
        id: "F-0004",
        teacherName: "鈴木 先生",
        comment: "気づきを次の行動にどうつなげるか、次回聞かせてください。",
        createdAt: "2026-06-06T12:00",
      },
    ],
    aiDialogue: closedDialogue("ボランティア", "地域清掃活動に参加", [2, 2, 1, 0, 1]),
    createdAt: "2026-06-05T16:20",
  },
  {
    id: "R-0010",
    studentId: "S-004",
    category: "部活動",
    title: "吹奏楽部 初めての合奏体験",
    date: "2026-06-29",
    content: "入部後はじめての合奏練習。周りのテンポについていくのに必死だった。",
    photos: [],
    visibility: "担当教員のみ",
    status: "未確認",
    feedback: [],
    aiDialogue: inProgressDialogue([1, null, null, null, null]),
    createdAt: "2026-06-29T18:00",
  },
  {
    id: "R-0011",
    studentId: "S-005",
    category: "探究学習",
    title: "海洋プラスチック問題の実験レポート",
    date: "2026-06-10",
    content: "海岸で採取したマイクロプラスチックのサンプルを顕微鏡で観察し、種類ごとに分類した。",
    reflection: "分類基準を自分たちで決める難しさを実感した。",
    photos: ["sample1.jpg", "sample2.jpg"],
    visibility: "担当教員のみ",
    status: "確認済み",
    feedback: [
      {
        id: "F-0005",
        teacherName: "鈴木 先生",
        comment:
          "分類基準を自分たちで検討したプロセスがとても探究的です。再検証の視点も含めて、次のまとめが楽しみです。",
        createdAt: "2026-06-11T09:15",
      },
    ],
    aiDialogue: closedDialogue(
      "探究学習",
      "海洋プラスチック問題の実験レポート",
      [0, 1, 2, 0, 1, 2, 0]
    ),
    createdAt: "2026-06-10T19:30",
  },
  {
    id: "R-0012",
    studentId: "S-005",
    category: "探究学習",
    title: "実験の再検証と考察",
    date: "2026-06-24",
    content: "前回の分類基準を見直し、再度サンプルを分類。結果の再現性を確認した。",
    photos: [],
    visibility: "担当教員のみ",
    status: "未確認",
    feedback: [],
    aiDialogue: closedDialogue("探究学習", "実験の再検証と考察", [1, 0, 0, 2, 1]),
    createdAt: "2026-06-24T20:10",
  },
  {
    id: "R-0013",
    studentId: "S-005",
    category: "ボランティア",
    title: "被災地支援の募金活動運営",
    date: "2026-07-01",
    content: "駅前で募金活動を企画・運営。呼びかけ方によって反応が大きく変わることに気づいた。",
    reflection: "人前で声を出すのが最初は怖かった。",
    photos: [],
    visibility: "担当教員のみ",
    status: "未確認",
    feedback: [],
    aiDialogue: awaitingChoiceDialogue([0, 1, 2, 0, 1]),
    createdAt: "2026-07-01T18:00",
  },
  {
    id: "R-0014",
    studentId: "S-005",
    category: "探究学習",
    title: "1学期 探究中間ふりかえり",
    date: "2026-06-27",
    content: "テーマ「海洋マイクロプラスチックの分布傾向」。実験を2回終え、傾向が見え始めている。",
    photos: [],
    visibility: "担当教員のみ",
    status: "確認済み",
    feedback: [
      {
        id: "F-0006",
        teacherName: "鈴木 先生",
        comment: "早めの提出、ありがとう。傾向が見えてきたところをぜひ発表にもつなげましょう。",
        createdAt: "2026-06-28T08:00",
      },
    ],
    aiDialogue: closedDialogue("探究学習", "1学期 探究中間ふりかえり", [0, 0, 1, 2, 0]),
    taskId: "TASK-001",
    submittedLate: false,
    createdAt: "2026-06-27T15:00",
  },
];

export const INITIAL_STUDENTS: Student[] = [
  { id: "S-001", displayName: "生徒001", points: 245, streakDays: 6, lastRecordDate: "2026-07-01" },
  { id: "S-002", displayName: "生徒002", points: 95, streakDays: 3, lastRecordDate: "2026-07-02" },
  { id: "S-003", displayName: "生徒003", points: 40, streakDays: 1, lastRecordDate: "2026-06-24" },
  { id: "S-004", displayName: "生徒004", points: 15, streakDays: 1, lastRecordDate: "2026-06-29" },
  { id: "S-005", displayName: "生徒005", points: 320, streakDays: 9, lastRecordDate: "2026-07-01" },
];

export const INITIAL_POINT_EVENTS: PointEvent[] = [
  { id: "P-0001", studentId: "S-001", amount: 10, reason: "記録を書く：商店街の空き家調査", createdAt: "2026-06-15T18:40" },
  { id: "P-0002", studentId: "S-001", amount: 15, reason: "AI深掘りを完了", createdAt: "2026-06-15T18:55" },
  { id: "P-0003", studentId: "S-001", amount: 20, reason: "タスク早期提出ボーナス：1学期 探究中間ふりかえり", createdAt: "2026-07-01T21:10" },
  { id: "P-0004", studentId: "S-002", amount: 10, reason: "記録を書く：バスケ部 県大会予選レポート", createdAt: "2026-06-18T20:15" },
  { id: "P-0005", studentId: "S-003", amount: 10, reason: "記録を書く：地域清掃活動に参加", createdAt: "2026-06-05T16:20" },
  { id: "P-0006", studentId: "S-004", amount: 10, reason: "記録を書く：吹奏楽部 初めての合奏体験", createdAt: "2026-06-29T18:00" },
  { id: "P-0007", studentId: "S-005", amount: 15, reason: "AI深掘りを完了（追加ラウンド含む）", createdAt: "2026-06-10T19:50" },
  { id: "P-0008", studentId: "S-005", amount: 20, reason: "タスク早期提出ボーナス：1学期 探究中間ふりかえり", createdAt: "2026-06-27T15:00" },
];
