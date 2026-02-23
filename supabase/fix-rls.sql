-- Fix RLS Policy for Waitlist Table
-- Run this in Supabase SQL Editor

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public inserts" ON waitlist;
DROP POLICY IF EXISTS "Allow authenticated read" ON waitlist;

-- Disable RLS temporarily to ensure clean slate
ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone (including anon) to insert
CREATE POLICY "Enable insert for anon users" ON waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy for reading (for admins later)
CREATE POLICY "Enable read for authenticated users" ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'waitlist';
