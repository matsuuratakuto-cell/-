-- 探究活動記録・分析システム / Supabaseスキーマ
-- Supabaseダッシュボードの SQL Editor に貼り付けて一度だけ実行してください。
-- 匿名化方針：students / records 等の業務テーブルには氏名・メールアドレスを一切保持しない。
--            メールアドレスは auth.users（Supabase内部管理領域）にのみ一時的に存在し、
--            招待の突合が終わった時点で pending_student_invites から削除する。

-- =========================================================
-- 1. ENUM 型
-- =========================================================
create type category as enum ('探究学習', '部活動', '修学旅行', 'ボランティア', 'その他');
create type visibility as enum ('担当教員のみ', 'コース内公開', '非公開');
create type record_status as enum ('未確認', '確認済み');
create type dialogue_status as enum ('in_progress', 'awaiting_continue_choice', 'closed');
create type task_target_type as enum ('all', 'individual');
-- 富山第一高等学校のコース構成を参考にしたコース区分（本パイロットは総合コースが対象）
create type student_course as enum ('S特別進学コース', '特別進学コース', '総合コース', '美術コース');

-- =========================================================
-- 2. テーブル
-- =========================================================

-- 教員（匿名化の対象外。氏名を保持する）
create table teachers (
  id text primary key,
  auth_user_id uuid unique references auth.users(id) on delete set null,
  name text not null,
  created_at timestamptz not null default now()
);

-- 生徒（匿名化の対象。システム番号のみを保持し、氏名・メールは持たない）
-- 学年・コース・クラスは、教員招待の時点では未確定（NULL）。
-- 生徒が初回ログイン後に complete_student_profile() で自己入力し、確定させる。
create table students (
  id text primary key,
  auth_user_id uuid unique references auth.users(id) on delete set null,
  grade smallint check (grade between 1 and 3),
  course student_course,
  class_name text,
  points integer not null default 0,
  streak_days integer not null default 0,
  last_record_date date,
  created_at timestamptz not null default now()
);

-- 教員による生徒アカウント発行待ち（email はここに一時的にのみ存在し、突合後に削除される）
create table pending_student_invites (
  email text primary key,
  student_id text not null references students(id) on delete cascade,
  invited_by text references teachers(id),
  created_at timestamptz not null default now()
);

create table pending_teacher_invites (
  email text primary key,
  teacher_id text not null references teachers(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 教員の担当生徒割り当て
create table teacher_assignments (
  teacher_id text not null references teachers(id) on delete cascade,
  student_id text not null references students(id) on delete cascade,
  primary key (teacher_id, student_id)
);

-- 管理者（8章：AI対話履歴の監査等）
create table admins (
  auth_user_id uuid primary key references auth.users(id) on delete cascade
);

-- 記録タスク
create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category category not null,
  instruction text not null,
  due_at timestamptz not null,
  target_type task_target_type not null default 'all',
  created_by text references teachers(id),
  created_at timestamptz not null default now()
);

create table task_targets (
  task_id uuid not null references tasks(id) on delete cascade,
  student_id text not null references students(id) on delete cascade,
  primary key (task_id, student_id)
);

-- 活動記録
create table records (
  id uuid primary key default gen_random_uuid(),
  student_id text not null references students(id) on delete cascade,
  category category not null,
  title text not null,
  activity_date date not null,
  content text not null,
  reflection text,
  photos text[] not null default '{}',
  visibility visibility not null default '担当教員のみ',
  status record_status not null default '未確認',
  task_id uuid references tasks(id),
  submitted_late boolean,
  ai_status dialogue_status not null default 'in_progress',
  ai_summary text,
  ai_completed_fully boolean not null default false,
  created_at timestamptz not null default now()
);

-- AI深掘り対話の質問バンク（モック用の固定質問。次フェーズでGemini生成に置き換え可能）
create table ai_question_bank (
  round_index integer primary key,
  question text not null,
  choices text[] not null
);

-- 記録ごとのAI対話ラウンド
create table ai_dialogue_rounds (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references records(id) on delete cascade,
  round integer not null,
  question text not null,
  choices text[] not null,
  selected_index integer,
  created_at timestamptz not null default now(),
  unique (record_id, round)
);

-- 教員フィードバック
create table feedback (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references records(id) on delete cascade,
  teacher_id text not null references teachers(id),
  comment text not null,
  created_at timestamptz not null default now()
);

-- ポイント履歴
create table point_events (
  id uuid primary key default gen_random_uuid(),
  student_id text not null references students(id) on delete cascade,
  amount integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

-- タスクの督促ログ
create table reminders (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  student_id text not null references students(id) on delete cascade,
  sent_at timestamptz not null default now()
);

-- 質問バンクの初期データ（lib/aiQuestions.ts と同一内容）
insert into ai_question_bank (round_index, question, choices) values
  (1, 'この活動の中で、一番「あれ？」と思った瞬間はどれに近いですか？', array['予想と違う結果が出た瞬間', '誰かの意見に驚いた瞬間', '自分の思い込みに気づいた瞬間']),
  (2, 'その気づきをもう少し深めると、原因は何だと思いますか？', array['準備や下調べが足りなかった', '自分の視点が偏っていた', 'そもそも問いの立て方が甘かった']),
  (3, '次に同じ場面が来たら、どう変えたいですか？', array['事前にもっと調べてから臨む', '人に相談してから動く', '小さく試してから本番に臨む']),
  (4, 'この経験は、あなたの「得意・好き」とどうつながっていますか？', array['人と話して情報を集めるのが得意', 'データや根拠を整理するのが好き', '手を動かして形にするのが得意']),
  (5, '今回の活動を一言で表すなら、どれが近いですか？', array['挑戦', '発見', '反省']),
  (6, 'この経験を、将来の進路とどうつなげたいですか？', array['専門的に学びを深めたい分野が見えた', '人と協力する力を伸ばしたいと思った', 'まだよく分からないが興味は持てた']),
  (7, '振り返ってみて、周りの人との関わりはどうでしたか？', array['自分から働きかけられた', '周りに助けられる場面が多かった', 'あまり深く関われなかった']),
  (8, 'この活動を通じて、一番成長したと感じる部分は？', array['考える力', '行動する力', '続ける力']);

-- =========================================================
-- 3. ヘルパー関数
-- =========================================================
create function current_student_id() returns text
language sql stable security definer set search_path = public as $$
  select id from students where auth_user_id = auth.uid();
$$;

create function current_teacher_id() returns text
language sql stable security definer set search_path = public as $$
  select id from teachers where auth_user_id = auth.uid();
$$;

create function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from admins where auth_user_id = auth.uid());
$$;

-- =========================================================
-- 4. 招待突合トリガー（auth.users に新規ユーザーが作られたら実行）
-- =========================================================
create function handle_new_auth_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_student_id text;
  v_teacher_id text;
begin
  select student_id into v_student_id from pending_student_invites where email = new.email;
  if v_student_id is not null then
    update students set auth_user_id = new.id where id = v_student_id;
    delete from pending_student_invites where email = new.email;
  end if;

  select teacher_id into v_teacher_id from pending_teacher_invites where email = new.email;
  if v_teacher_id is not null then
    update teachers set auth_user_id = new.id where id = v_teacher_id;
    delete from pending_teacher_invites where email = new.email;
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();

-- =========================================================
-- 5. RLS 有効化 + 参照ポリシー
-- =========================================================
alter table teachers enable row level security;
alter table students enable row level security;
alter table pending_student_invites enable row level security;
alter table pending_teacher_invites enable row level security;
alter table teacher_assignments enable row level security;
alter table admins enable row level security;
alter table tasks enable row level security;
alter table task_targets enable row level security;
alter table records enable row level security;
alter table ai_question_bank enable row level security;
alter table ai_dialogue_rounds enable row level security;
alter table feedback enable row level security;
alter table point_events enable row level security;
alter table reminders enable row level security;

-- teachers: 認証済みなら誰でも氏名一覧を読める（氏名は非匿名情報のため問題なし）
create policy teachers_select_all on teachers for select
  to authenticated using (true);

-- students: 本人 / 担当教員 / 管理者のみ参照可
create policy students_select_self_or_assigned on students for select
  to authenticated using (
    auth_user_id = auth.uid()
    or is_admin()
    or exists (
      select 1 from teacher_assignments ta
      where ta.student_id = students.id and ta.teacher_id = current_teacher_id()
    )
  );

-- teacher_assignments: 本人教員 / 管理者のみ
create policy teacher_assignments_select on teacher_assignments for select
  to authenticated using (teacher_id = current_teacher_id() or is_admin());

-- ai_question_bank: 認証済み全員が参照可（質問文そのものは非機密）
create policy ai_question_bank_select on ai_question_bank for select
  to authenticated using (true);

-- tasks: 生徒は自分が対象のタスク、教員は自分が発行したタスク、管理者は全件
create policy tasks_select on tasks for select
  to authenticated using (
    is_admin()
    or created_by = current_teacher_id()
    or target_type = 'all'
    or exists (
      select 1 from task_targets tt
      where tt.task_id = tasks.id and tt.student_id = current_student_id()
    )
  );

create policy task_targets_select on task_targets for select
  to authenticated using (
    is_admin()
    or student_id = current_student_id()
    or exists (select 1 from tasks t where t.id = task_targets.task_id and t.created_by = current_teacher_id())
  );

-- records: 本人生徒 / 担当教員 / 管理者
create policy records_select on records for select
  to authenticated using (
    student_id = current_student_id()
    or is_admin()
    or exists (
      select 1 from teacher_assignments ta
      where ta.student_id = records.student_id and ta.teacher_id = current_teacher_id()
    )
  );

create policy ai_dialogue_rounds_select on ai_dialogue_rounds for select
  to authenticated using (
    exists (
      select 1 from records r
      where r.id = ai_dialogue_rounds.record_id
        and (
          r.student_id = current_student_id()
          or is_admin()
          or exists (select 1 from teacher_assignments ta where ta.student_id = r.student_id and ta.teacher_id = current_teacher_id())
        )
    )
  );

create policy feedback_select on feedback for select
  to authenticated using (
    exists (
      select 1 from records r
      where r.id = feedback.record_id
        and (
          r.student_id = current_student_id()
          or is_admin()
          or exists (select 1 from teacher_assignments ta where ta.student_id = r.student_id and ta.teacher_id = current_teacher_id())
        )
    )
  );

create policy point_events_select on point_events for select
  to authenticated using (
    student_id = current_student_id()
    or is_admin()
    or exists (select 1 from teacher_assignments ta where ta.student_id = point_events.student_id and ta.teacher_id = current_teacher_id())
  );

create policy reminders_select on reminders for select
  to authenticated using (
    student_id = current_student_id()
    or is_admin()
    or exists (select 1 from tasks t where t.id = reminders.task_id and t.created_by = current_teacher_id())
  );

-- 直接の insert/update/delete は業務テーブルに対して一切許可しない。
-- すべての書き込みは下記 SECURITY DEFINER 関数（RPC）経由でのみ行う。

-- =========================================================
-- 6. RPC 関数（すべての書き込みはここを通す）
-- =========================================================

-- 記録を作成し、ポイント・連続日数・タスク早期提出ボーナスを計算し、AI対話の1問目を発行する
create function add_activity_record(
  p_category category,
  p_title text,
  p_activity_date date,
  p_content text,
  p_reflection text,
  p_photos text[],
  p_visibility visibility,
  p_task_id uuid
) returns records
language plpgsql security definer set search_path = public as $$
declare
  v_student_id text := current_student_id();
  v_student students;
  v_task tasks;
  v_streak_days integer;
  v_streak_bonus integer := 0;
  v_task_bonus integer := 0;
  v_submitted_late boolean;
  v_record records;
  v_q ai_question_bank;
begin
  if v_student_id is null then
    raise exception 'この操作は生徒アカウントでのみ実行できます';
  end if;

  select * into v_student from students where id = v_student_id;

  if v_student.last_record_date = p_activity_date then
    v_streak_days := v_student.streak_days;
  elsif v_student.last_record_date = (p_activity_date - 1) then
    v_streak_days := v_student.streak_days + 1;
    v_streak_bonus := v_streak_days * 2;
  else
    v_streak_days := 1;
  end if;

  if p_task_id is not null then
    select * into v_task from tasks where id = p_task_id;
    v_submitted_late := now() > v_task.due_at;
    if not v_submitted_late then
      v_task_bonus := 20;
    end if;
  end if;

  insert into records (student_id, category, title, activity_date, content, reflection, photos, visibility, task_id, submitted_late)
  values (v_student_id, p_category, p_title, p_activity_date, p_content, p_reflection, coalesce(p_photos, '{}'), p_visibility, p_task_id, v_submitted_late)
  returning * into v_record;

  select * into v_q from ai_question_bank where round_index = 1;
  insert into ai_dialogue_rounds (record_id, round, question, choices) values (v_record.id, 1, v_q.question, v_q.choices);

  update students
    set points = points + 10 + v_streak_bonus + v_task_bonus,
        streak_days = v_streak_days,
        last_record_date = p_activity_date
    where id = v_student_id;

  insert into point_events (student_id, amount, reason) values (v_student_id, 10, '記録を書く：' || p_title);
  if v_streak_bonus > 0 then
    insert into point_events (student_id, amount, reason) values (v_student_id, v_streak_bonus, '継続ボーナス（' || v_streak_days || '日連続）');
  end if;
  if v_task_bonus > 0 then
    insert into point_events (student_id, amount, reason) values (v_student_id, v_task_bonus, 'タスク早期提出ボーナス：' || v_task.title);
  end if;

  return v_record;
end;
$$;

-- AI対話の回答を送信する。5問目以降は継続選択待ちに遷移する
create function answer_dialogue_round(p_record_id uuid, p_round integer, p_selected_index integer) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_student_id text := current_student_id();
  v_owner text;
  v_q ai_question_bank;
begin
  select student_id into v_owner from records where id = p_record_id;
  if v_owner is null or v_owner <> v_student_id then
    raise exception '自分の記録以外は操作できません';
  end if;

  update ai_dialogue_rounds set selected_index = p_selected_index
    where record_id = p_record_id and round = p_round;

  if p_round >= 5 then
    update records set ai_status = 'awaiting_continue_choice' where id = p_record_id;
  else
    select * into v_q from ai_question_bank where round_index = ((p_round) % 8) + 1;
    insert into ai_dialogue_rounds (record_id, round, question, choices)
      values (p_record_id, p_round + 1, v_q.question, v_q.choices);
    update records set ai_status = 'in_progress' where id = p_record_id;
  end if;
end;
$$;

-- 「さらに深掘りする」を選んだ場合、追加のラウンドを発行する
create function continue_dialogue(p_record_id uuid) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_student_id text := current_student_id();
  v_owner text;
  v_next_round integer;
  v_q ai_question_bank;
begin
  select student_id into v_owner from records where id = p_record_id;
  if v_owner is null or v_owner <> v_student_id then
    raise exception '自分の記録以外は操作できません';
  end if;

  select coalesce(max(round), 0) + 1 into v_next_round from ai_dialogue_rounds where record_id = p_record_id;
  select * into v_q from ai_question_bank where round_index = ((v_next_round - 1) % 8) + 1;
  insert into ai_dialogue_rounds (record_id, round, question, choices) values (p_record_id, v_next_round, v_q.question, v_q.choices);
  update records set ai_status = 'in_progress' where id = p_record_id;
end;
$$;

-- 「ここで終える」を選んだ場合、サマリーを生成してクローズし、+15ptを付与する
-- 次フェーズ：この関数内のサマリー生成ロジックをGemini API呼び出し（Edge Function経由）に置き換える
create function close_dialogue(p_record_id uuid) returns records
language plpgsql security definer set search_path = public as $$
declare
  v_student_id text := current_student_id();
  v_owner text;
  v_title text;
  v_category category;
  v_choice_texts text[];
  v_summary text;
  v_record records;
begin
  select student_id, title, category into v_owner, v_title, v_category from records where id = p_record_id;
  if v_owner is null or v_owner <> v_student_id then
    raise exception '自分の記録以外は操作できません';
  end if;

  select array_agg(choices[selected_index + 1] order by round) into v_choice_texts
    from ai_dialogue_rounds where record_id = p_record_id and selected_index is not null;

  v_summary := format(
    '「%s」（%s）についての対話では、まず%sをきっかけに振り返りが始まった。その背景を掘り下げると、%sに気づき、次に活かす工夫として%sを挙げた。また、%sとの結びつきにも言及し、今回の経験を一言で表すと「%s」であるとまとめた。表層的な感想にとどまらず、原因の分析と次の行動への意識づけまで踏み込めた対話となった。',
    v_title, v_category,
    coalesce(v_choice_texts[1], '活動の中で印象に残った出来事'),
    coalesce(v_choice_texts[2], '自分の準備や視点に課題があったこと'),
    coalesce(v_choice_texts[3], '事前の準備を見直すこと'),
    coalesce(v_choice_texts[4], '自分の得意なこと'),
    coalesce(v_choice_texts[5], '挑戦')
  );

  update records set ai_status = 'closed', ai_completed_fully = true, ai_summary = v_summary
    where id = p_record_id returning * into v_record;

  update students set points = points + 15 where id = v_student_id;
  insert into point_events (student_id, amount, reason) values (v_student_id, 15, 'AI深掘りを完了：' || v_title);

  return v_record;
end;
$$;

-- 教員がフィードバックを追加する（同時に記録を確認済みにする）
create function add_feedback(p_record_id uuid, p_comment text) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_teacher_id text := current_teacher_id();
  v_student_id text;
begin
  if v_teacher_id is null then
    raise exception 'この操作は教員アカウントでのみ実行できます';
  end if;

  select student_id into v_student_id from records where id = p_record_id;
  if not exists (select 1 from teacher_assignments where teacher_id = v_teacher_id and student_id = v_student_id) then
    raise exception '担当していない生徒の記録です';
  end if;

  insert into feedback (record_id, teacher_id, comment) values (p_record_id, v_teacher_id, p_comment);
  update records set status = '確認済み' where id = p_record_id;
end;
$$;

-- 教員が記録のステータスを変更する
create function set_record_status(p_record_id uuid, p_status record_status) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_teacher_id text := current_teacher_id();
  v_student_id text;
begin
  if v_teacher_id is null then
    raise exception 'この操作は教員アカウントでのみ実行できます';
  end if;
  select student_id into v_student_id from records where id = p_record_id;
  if not exists (select 1 from teacher_assignments where teacher_id = v_teacher_id and student_id = v_student_id) then
    raise exception '担当していない生徒の記録です';
  end if;
  update records set status = p_status where id = p_record_id;
end;
$$;

-- 教員がタスクを発行する
create function create_task(
  p_title text,
  p_category category,
  p_instruction text,
  p_due_at timestamptz,
  p_target_type task_target_type,
  p_target_student_ids text[]
) returns tasks
language plpgsql security definer set search_path = public as $$
declare
  v_teacher_id text := current_teacher_id();
  v_task tasks;
  v_sid text;
begin
  if v_teacher_id is null then
    raise exception 'この操作は教員アカウントでのみ実行できます';
  end if;

  insert into tasks (title, category, instruction, due_at, target_type, created_by)
    values (p_title, p_category, p_instruction, p_due_at, p_target_type, v_teacher_id)
    returning * into v_task;

  if p_target_type = 'individual' then
    foreach v_sid in array p_target_student_ids loop
      insert into task_targets (task_id, student_id) values (v_task.id, v_sid);
    end loop;
  end if;

  return v_task;
end;
$$;

-- 教員が未提出者にリマインドを送る（モック：ログを残すのみ）
create function remind_student(p_task_id uuid, p_student_id text) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_teacher_id text := current_teacher_id();
begin
  if v_teacher_id is null then
    raise exception 'この操作は教員アカウントでのみ実行できます';
  end if;
  insert into reminders (task_id, student_id) values (p_task_id, p_student_id);
end;
$$;

-- 生徒アカウントの発行（教員が対象生徒のシステム番号とメールアドレスを登録する。学籍情報は生徒本人が初回ログイン後に入力する）
create function invite_student(p_student_id text, p_email text) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_teacher_id text := current_teacher_id();
begin
  if v_teacher_id is null then
    raise exception 'この操作は教員アカウントでのみ実行できます';
  end if;
  insert into students (id) values (p_student_id) on conflict (id) do nothing;
  insert into teacher_assignments (teacher_id, student_id) values (v_teacher_id, p_student_id) on conflict do nothing;
  insert into pending_student_invites (email, student_id, invited_by) values (p_email, p_student_id, v_teacher_id)
    on conflict (email) do update set student_id = excluded.student_id;
end;
$$;

-- 生徒が初回ログイン後に自分の学年・コース・クラスを入力し、プロフィールを確定させる
create function complete_student_profile(p_grade smallint, p_course student_course, p_class_name text) returns students
language plpgsql security definer set search_path = public as $$
declare
  v_student_id text := current_student_id();
  v_student students;
begin
  if v_student_id is null then
    raise exception 'この操作は生徒アカウントでのみ実行できます';
  end if;
  update students set grade = p_grade, course = p_course, class_name = p_class_name
    where id = v_student_id
    returning * into v_student;
  return v_student;
end;
$$;
