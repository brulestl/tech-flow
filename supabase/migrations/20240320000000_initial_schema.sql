-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE resource_type AS ENUM ('article', 'video', 'book', 'course', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email CITEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT,
    type resource_type NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    summary TEXT,
    summary_status TEXT DEFAULT 'pending' CHECK (summary_status IN ('pending', 'processing', 'completed', 'failed')),
    summary_updated_at TIMESTAMPTZ,
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(summary, '')), 'C')
    ) STORED
);

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create junction tables
CREATE TABLE IF NOT EXISTS resource_collections (
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (resource_id, collection_id)
);

CREATE TABLE IF NOT EXISTS resource_tags (
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (resource_id, tag_id)
);

-- Create flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    front_content TEXT NOT NULL,
    back_content TEXT NOT NULL,
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    last_reviewed_at TIMESTAMPTZ,
    next_review_at TIMESTAMPTZ,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create study sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    cards_reviewed INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_study_date DATE
);

-- Create flashcard reviews table
CREATE TABLE IF NOT EXISTS flashcard_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flashcard_id UUID REFERENCES flashcards(id) ON DELETE CASCADE,
    study_session_id UUID REFERENCES study_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    was_correct BOOLEAN NOT NULL,
    review_time INTEGER, -- in seconds
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_resources_user_id ON resources(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_resource_collections_collection_id ON resource_collections(collection_id);
CREATE INDEX IF NOT EXISTS idx_resource_collections_resource_id ON resource_collections(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_tags_tag_id ON resource_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_resource_tags_resource_id ON resource_tags(resource_id);
CREATE INDEX IF NOT EXISTS idx_resources_search ON resources USING GIN (search_vector);

-- Add indexes for new tables
CREATE INDEX IF NOT EXISTS idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_resource_id ON flashcards(resource_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_next_review ON flashcards(next_review_at);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_reviews_flashcard_id ON flashcard_reviews(flashcard_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_reviews_study_session_id ON flashcard_reviews(study_session_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_reviews_user_id ON flashcard_reviews(user_id);

-- Enable RLS for new tables
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for new tables if they exist
DROP POLICY IF EXISTS "Users can manage their own flashcards" ON flashcards;
DROP POLICY IF EXISTS "Users can manage their own study sessions" ON study_sessions;
DROP POLICY IF EXISTS "Users can manage their own flashcard reviews" ON flashcard_reviews;

-- Create RLS policies for new tables
CREATE POLICY "Users can manage their own flashcards"
    ON flashcards FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own study sessions"
    ON study_sessions FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own flashcard reviews"
    ON flashcard_reviews FOR ALL
    USING (user_id = auth.uid());

-- Add updated_at trigger for flashcards
CREATE TRIGGER update_flashcards_updated_at
    BEFORE UPDATE ON flashcards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create search function
CREATE OR REPLACE FUNCTION search_resources(search_query text)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    similarity float
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.title,
        r.description,
        ts_rank(r.search_vector, to_tsquery('english', search_query)) as similarity
    FROM resources r
    WHERE r.search_vector @@ to_tsquery('english', search_query)
    ORDER BY similarity DESC;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_resources_updated_at ON resources;
DROP TRIGGER IF EXISTS update_collections_updated_at ON collections;

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at
    BEFORE UPDATE ON collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_tags ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Resources are viewable by owner and public collections" ON resources;
DROP POLICY IF EXISTS "Users can manage their own resources" ON resources;
DROP POLICY IF EXISTS "Collections are viewable by owner and if public" ON collections;
DROP POLICY IF EXISTS "Users can manage their own collections" ON collections;
DROP POLICY IF EXISTS "Tags are viewable by all" ON tags;
DROP POLICY IF EXISTS "Resource collections are viewable by collection owner" ON resource_collections;
DROP POLICY IF EXISTS "Resource tags are viewable by resource owner" ON resource_tags;

-- Create RLS policies
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
    ON users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Resources are viewable by owner and public collections"
    ON resources FOR SELECT
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 
            FROM resource_collections 
            JOIN collections ON resource_collections.collection_id = collections.id
            WHERE resource_collections.resource_id = resources.id 
            AND collections.is_public = true
        )
    );

CREATE POLICY "Users can manage their own resources"
    ON resources FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Collections are viewable by owner and if public"
    ON collections FOR SELECT
    USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can manage their own collections"
    ON collections FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Tags are viewable by all"
    ON tags FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Resource collections are viewable by collection owner"
    ON resource_collections FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM collections 
            WHERE collections.id = resource_collections.collection_id
            AND collections.user_id = auth.uid()
        )
    );

CREATE POLICY "Resource tags are viewable by resource owner"
    ON resource_tags FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM resources 
            WHERE resources.id = resource_tags.resource_id
            AND resources.user_id = auth.uid()
        )
    ); 