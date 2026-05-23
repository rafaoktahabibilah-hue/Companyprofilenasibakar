CREATE TABLE "PollVote" (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" text NOT NULL,
  "characterId" text NOT NULL,
  "votedAt" timestamptz DEFAULT now(),
  UNIQUE ("userId", "characterId")
);

ALTER TABLE "PollVote" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view votes" ON "PollVote"
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own vote" ON "PollVote"
  FOR INSERT WITH CHECK ("userId" = auth.uid()::text);
