import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qfgigdwevehjpjzjzuwm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmZ2lnZHdldmVoanBqemp6dXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MzExMjIsImV4cCI6MjA4MTAwNzEyMn0.uQs0olXy0xdTAZ8vZ22uxLG_e1veOfNpjyB80xs0rog';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
