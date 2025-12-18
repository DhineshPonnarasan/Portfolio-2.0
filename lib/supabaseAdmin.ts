import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qfgigdwevehjpjzjzuwm.supabase.co';
const supabaseServiceRoleKey = 'sb_secret_rZHs_zg1jBhA4SrKVM284w_aQoW2bQw';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
