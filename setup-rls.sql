-- Enable Row Level Security
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Favorite" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "History" ENABLE ROW LEVEL SECURITY;

-- Fix: add gen_random_uuid() defaults for id columns
ALTER TABLE "Favorite" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "History" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "PollVote" ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix: add unique constraints for upsert to work
-- (drop orphan indexes first if they exist)
DROP INDEX IF EXISTS "Favorite_userId_mangaId_key";
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_mangaId_key" UNIQUE ("userId", "mangaId");

DROP INDEX IF EXISTS "History_userId_mangaId_key";
ALTER TABLE "History" ADD CONSTRAINT "History_userId_mangaId_key" UNIQUE ("userId", "mangaId");

-- User policies: users can only read/update their own row
CREATE POLICY "Users can view own profile" ON "User"
  FOR SELECT USING (id::text = auth.uid()::text);

CREATE POLICY "Users can update own profile" ON "User"
  FOR UPDATE USING (id::text = auth.uid()::text);

CREATE POLICY "Users can insert own profile" ON "User"
  FOR INSERT WITH CHECK (id::text = auth.uid()::text);

-- Favorite policies: users can only access their own favorites
CREATE POLICY "Users can view own favorites" ON "Favorite"
  FOR SELECT USING ("userId" = auth.uid()::text);

CREATE POLICY "Users can insert own favorites" ON "Favorite"
  FOR INSERT WITH CHECK ("userId" = auth.uid()::text);

CREATE POLICY "Users can delete own favorites" ON "Favorite"
  FOR DELETE USING ("userId" = auth.uid()::text);

-- History policies: users can only access their own history
CREATE POLICY "Users can view own history" ON "History"
  FOR SELECT USING ("userId" = auth.uid()::text);

CREATE POLICY "Users can insert own history" ON "History"
  FOR INSERT WITH CHECK ("userId" = auth.uid()::text);

CREATE POLICY "Users can update own history" ON "History"
  FOR UPDATE USING ("userId" = auth.uid()::text);

CREATE POLICY "Users can delete own history" ON "History"
  FOR DELETE USING ("userId" = auth.uid()::text);

-- PollVote policies
CREATE POLICY "Anyone can view votes" ON "PollVote"
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own vote" ON "PollVote"
  FOR INSERT WITH CHECK ("userId" = auth.uid()::text);
