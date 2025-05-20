-- Create study sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    cards_reviewed INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_study_date DATE
);

-- Create index for study sessions
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);

-- Enable RLS
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Users can manage their own study sessions"
    ON study_sessions FOR ALL
    USING (user_id = auth.uid()); 