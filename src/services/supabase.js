import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qqayisixsrhotlnclfjo.supabase.co';
const supabaseAnonKey = 'sb_publishable_gDKCYTby3vYKCqxMevLcxw_h1Zx3mTa';

// This exact line is what Dashboard.jsx is looking for!
export const supabase = createClient(supabaseUrl, supabaseAnonKey);