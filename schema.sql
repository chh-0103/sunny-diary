-- 在 Supabase SQL Editor 中执行以下 SQL

CREATE TABLE diaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  mood TEXT NOT NULL,
  weather TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  supplements JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own diaries"
  ON diaries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diaries"
  ON diaries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diaries"
  ON diaries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own diaries"
  ON diaries FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_diaries_user_created ON diaries(user_id, created_at DESC);