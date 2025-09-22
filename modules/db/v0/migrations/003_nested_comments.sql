-- Migration: 003_nested_comments
-- Description: Add support for nested comments (replies) in community

-- Add parent_comment_id column to support threaded replies
ALTER TABLE community_comments 
ADD COLUMN parent_comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE;

-- Add index for efficient parent-child lookups
CREATE INDEX IF NOT EXISTS idx_community_comments_parent_id ON community_comments(parent_comment_id);

-- Add check constraint to prevent self-referencing comments
ALTER TABLE community_comments 
ADD CONSTRAINT check_no_self_reference 
CHECK (id != parent_comment_id);