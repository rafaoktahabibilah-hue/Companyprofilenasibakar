import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://nhubpjovnpwadaxxsqyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odWJwam92bnB3YWRheHhzcXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNTAwNzUsImV4cCI6MjA5MzYyNjA3NX0.nEaqtMo77NVDSgl6MRZe0rr5T6dsf5JwEOrsqLHVJQw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true
  }
});

export { supabase, SUPABASE_URL, SUPABASE_ANON_KEY };
