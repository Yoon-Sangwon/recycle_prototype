/*
  # 게이미피케이션 시스템 스키마

  1. 새 테이블
    - `user_profiles`
      - `id` (uuid, primary key) - 사용자 ID
      - `email` (text) - 사용자 이메일
      - `username` (text) - 사용자 이름
      - `total_points` (integer) - 총 획득 점수
      - `level` (integer) - 사용자 레벨
      - `disposal_count` (integer) - 총 배출 횟수
      - `correct_disposal_count` (integer) - 올바른 분리배출 횟수
      - `streak_days` (integer) - 연속 배출 일수
      - `created_at` (timestamptz) - 생성 시간
      - `updated_at` (timestamptz) - 업데이트 시간

    - `disposal_records`
      - `id` (uuid, primary key) - 기록 ID
      - `user_id` (uuid, foreign key) - 사용자 ID
      - `waste_type` (text) - 쓰레기 유형
      - `is_correct` (boolean) - 올바른 분리배출 여부
      - `points_earned` (integer) - 획득한 점수
      - `image_url` (text, nullable) - 분석한 이미지 URL
      - `created_at` (timestamptz) - 기록 시간

    - `achievements`
      - `id` (uuid, primary key) - 업적 ID
      - `user_id` (uuid, foreign key) - 사용자 ID
      - `achievement_type` (text) - 업적 유형
      - `title` (text) - 업적 제목
      - `description` (text) - 업적 설명
      - `unlocked_at` (timestamptz) - 달성 시간

  2. Security
    - 모든 테이블에 RLS 활성화
    - 인증된 사용자만 자신의 데이터 접근 가능
*/

-- user_profiles 테이블 생성
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  username text NOT NULL,
  total_points integer DEFAULT 0,
  level integer DEFAULT 1,
  disposal_count integer DEFAULT 0,
  correct_disposal_count integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- disposal_records 테이블 생성
CREATE TABLE IF NOT EXISTS disposal_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  waste_type text NOT NULL,
  is_correct boolean DEFAULT true,
  points_earned integer DEFAULT 0,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE disposal_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own disposal records"
  ON disposal_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own disposal records"
  ON disposal_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- achievements 테이블 생성
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  unlocked_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_disposal_records_user_id ON disposal_records(user_id);
CREATE INDEX IF NOT EXISTS idx_disposal_records_created_at ON disposal_records(created_at);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);