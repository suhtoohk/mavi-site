import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vimtrsaxcpdfboqpiskc.supabase.co';
const supabasePublishableKey = 'sb_publishable_e9EN0PcWw_XW_dIWjs-sdA_nTC_EhB6';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
