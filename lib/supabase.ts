import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Criação do cliente Supabase com tratamento de erro
export const getSupabase = () => {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    return supabase;
  } catch (error) {
    console.error('Erro ao inicializar o Supabase:', error);
    // Retorna um cliente fictício em caso de erro para não quebrar a aplicação
    return {
      from: () => ({
        insert: () => Promise.resolve({ error: { message: 'Cliente Supabase não inicializado' } }),
        select: () => Promise.resolve({ data: null, error: { message: 'Cliente Supabase não inicializado' } }),
      }),
    } as any;
  }
};

// Cliente Supabase padrão
const supabase = getSupabase();

export default supabase; 