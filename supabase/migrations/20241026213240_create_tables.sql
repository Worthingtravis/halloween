-- Create costumes table
CREATE TABLE costumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    costume_id UUID NOT NULL REFERENCES costumes(id),
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on votes table for faster queries by category
CREATE INDEX votes_category_idx ON votes(category);

-- Create a view for vote counts by category
CREATE VIEW vote_counts AS
SELECT costume_id, category, COUNT(*) AS vote_count
FROM votes
GROUP BY costume_id, category;

-- Disable Row-Level Security on both tables (no access restrictions)
ALTER TABLE costumes DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;

-- Drop the prevent_multiple_votes function and trigger (no vote restrictions)
DROP FUNCTION IF EXISTS prevent_multiple_votes();
DROP TRIGGER IF EXISTS check_multiple_votes ON votes;

-- Grant access to all users without restrictions
GRANT INSERT, SELECT ON costumes TO PUBLIC;
GRANT INSERT, SELECT ON votes TO PUBLIC;
