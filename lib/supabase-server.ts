import { createClient } from '@supabase/supabase-js';

// Estas variáveis estarão disponíveis apenas no servidor
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

// Cliente Supabase para uso apenas no servidor
const supabaseServer = createClient(supabaseUrl, supabaseKey);

export default supabaseServer; 