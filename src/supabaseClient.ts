import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yolxtrxtavekgosmftwh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvbHh0cnh0YXZla2dvc21mdHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMzM0NjcsImV4cCI6MjA2NTkwOTQ2N30.J2sMUuoeeD1f9cZrfu6NIWtSeqidfu0g5x8ADZUfHqc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);