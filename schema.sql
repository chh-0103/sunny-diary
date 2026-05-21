CREATE TABLE IF NOT EXISTS diaries (
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

DROP POLICY IF EXISTS "Users can view own diaries" ON diaries;
CREATE POLICY "Users can view own diaries"
  ON diaries FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own diaries" ON diaries;
CREATE POLICY "Users can insert own diaries"
  ON diaries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own diaries" ON diaries;
CREATE POLICY "Users can update own diaries"
  ON diaries FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own diaries" ON diaries;
CREATE POLICY "Users can delete own diaries"
  ON diaries FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_diaries_user_created ON diaries(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  gender TEXT DEFAULT '',
  birthday TEXT DEFAULT '',
  birthplace TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  avatar_url TEXT DEFAULT '',
  status TEXT,
  status_emoji TEXT DEFAULT '',
  status_set_at TIMESTAMPTZ,
  status_history JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);