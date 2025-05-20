-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to resources table
ALTER TABLE resources ADD COLUMN IF NOT EXISTS embedding vector(1536);
ALTER TABLE resources ADD COLUMN IF NOT EXISTS summary TEXT;

-- Create function to calculate cosine similarity
CREATE OR REPLACE FUNCTION cosine_similarity(a vector, b vector)
RETURNS float
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN 1 - (a <=> b);
END;
$$;

-- Create view for resource clusters
CREATE OR REPLACE VIEW resource_clusters AS
WITH similarity_pairs AS (
    SELECT 
        r1.id as resource_id_1,
        r2.id as resource_id_2,
        cosine_similarity(r1.embedding, r2.embedding) as similarity
    FROM resources r1
    JOIN resources r2 ON r1.id < r2.id
    WHERE r1.embedding IS NOT NULL 
    AND r2.embedding IS NOT NULL
    AND cosine_similarity(r1.embedding, r2.embedding) > 0.7
)
SELECT 
    resource_id_1,
    resource_id_2,
    similarity,
    r1.title as resource_1_title,
    r2.title as resource_2_title
FROM similarity_pairs sp
JOIN resources r1 ON r1.id = sp.resource_id_1
JOIN resources r2 ON r2.id = sp.resource_id_2
ORDER BY similarity DESC;

-- Create index for faster similarity searches
CREATE INDEX IF NOT EXISTS resources_embedding_idx ON resources USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100); 