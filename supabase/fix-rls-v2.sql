-- Fix RLS Policy for Waitlist Table (Version 2)
-- This grants direct permissions to anon role

-- First, drop ALL existing policies
DROP POLICY IF EXISTS "Allow public inserts" ON waitlist;
DROP POLICY IF EXISTS "Allow authenticated read" ON waitlist;
DROP POLICY IF EXISTS "Enable insert for anon users" ON waitlist;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON waitlist;

-- Grant INSERT permission directly to anon role
GRANT INSERT ON waitlist TO anon;
GRANT SELECT ON waitlist TO authenticated;

-- Disable RLS temporarily
ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows ALL inserts
CREATE POLICY "allow_insert_waitlist" ON waitlist
  FOR INSERT
  WITH CHECK (true);

-- Create a policy for reading
CREATE POLICY "allow_select_waitlist" ON waitlist
  FOR SELECT
  USING (true);

-- Grant usage on the sequence (for auto-increment ID)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Verify everything
SELECT
  tablename,
  policyname,
  roles,
  cmd,
  with_check
FROM pg_policies
WHERE tablename = 'waitlist';

-- Also check table permissions
SELECT
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'waitlist';
