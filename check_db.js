import { supabase } from './src/services/supabase.js';

async function check() {
  const { data, error } = await supabase.from('platform_settings').select('*');
  console.log("platform_settings:", data, error);
  const { data: d2, error: e2 } = await supabase.from('settings').select('*');
  console.log("settings:", d2, e2);
}
check();
