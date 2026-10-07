import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
// we can't query pg_policies using anon key.
// I will just try to fetch all rows using the anon key.
supabase.from('client_requests').select('*').limit(5).then(({data, error}) => {
  console.log("ANON FETCH:", data ? data.length : error);
});
