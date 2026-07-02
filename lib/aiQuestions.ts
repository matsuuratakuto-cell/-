export interface QuestionTemplate {
  question: string;
  choices: [string, string, string];
}

// モック用のダミー質問セット。実際にはGemini APIが記録内容を読み取り動的に生成する想定だが、
// モックでは固定の質問バンクを順番に提示することで対話フローの見た目・遷移を再現する。
export const QUESTION_BANK: QuestionTemplate[] = [
  {
    question: "この活動の中で、一番「あれ？」と思った瞬間はどれに近いですか？",
    choices: [
      "予想と違う結果が出た瞬間",
      "誰かの意見に驚いた瞬間",
      "自分の思い込みに気づいた瞬間",
    ],
  },
  {
    question: "その気づきをもう少し深めると、原因は何だと思いますか？",
    choices: [
      "準備や下調べが足りなかった",
      "自分の視点が偏っていた",
      "そもそも問いの立て方が甘かった",
    ],
  },
  {
    question: "次に同じ場面が来たら、どう変えたいですか？",
    choices: [
      "事前にもっと調べてから臨む",
      "人に相談してから動く",
      "小さく試してから本番に臨む",
    ],
  },
  {
    question: "この経験は、あなたの「得意・好き」とどうつながっていますか？",
    choices: [
      "人と話して情報を集めるのが得意",
      "データや根拠を整理するのが好き",
      "手を動かして形にするのが得意",
    ],
  },
  {
    question: "今回の活動を一言で表すなら、どれが近いですか？",
    choices: ["挑戦", "発見", "反省"],
  },
  {
    question: "この経験を、将来の進路とどうつなげたいですか？",
    choices: [
      "専門的に学びを深めたい分野が見えた",
      "人と協力する力を伸ばしたいと思った",
      "まだよく分からないが興味は持てた",
    ],
  },
  {
    question: "振り返ってみて、周りの人との関わりはどうでしたか？",
    choices: [
      "自分から働きかけられた",
      "周りに助けられる場面が多かった",
      "あまり深く関われなかった",
    ],
  },
  {
    question: "この活動を通じて、一番成長したと感じる部分は？",
    choices: ["考える力", "行動する力", "続ける力"],
  },
];

export function getQuestionForRound(round: number): QuestionTemplate {
  return QUESTION_BANK[(round - 1) % QUESTION_BANK.length];
}
