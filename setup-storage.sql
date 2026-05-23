-- Supabase Storage bucket "avatars" RLS policies
-- Run this in Supabase SQL Editor
-- https://app.supabase.com/project/nhubpjovnpwadaxxsqyt/sql

-- Allow anyone (public) to view/read avatars
CREATE POLICY "Public read avatars" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'Avatars');

-- Allow authenticated users to upload avatar files
CREATE POLICY "Auth users upload avatars" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'Avatars'
    AND auth.role() = 'authenticated'
  );

-- Allow users to update their own uploaded file
CREATE POLICY "Users update own avatars" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'Avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'profiles'
  );

-- Allow users to delete their own uploaded file
CREATE POLICY "Users delete own avatars" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'Avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'profiles'
  );
