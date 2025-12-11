import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project values
const supabaseUrl = 'https://lnhjncoqesectwafejlw.supabase.co';

const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuaGpuY29xZXNlY3R3YWZlamx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NDcxNzYsImV4cCI6MjA4MTAyMzE3Nn0.hxIvvEfNI7zctu01cn9WFJqmSO3TVZSTyo40fHg0mLg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
