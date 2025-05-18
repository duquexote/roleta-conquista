import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { nome, numero } = await request.json();

    if (!nome || !numero) {
      return NextResponse.json(
        { error: 'Nome e número são obrigatórios' },
        { status: 400 }
      );
    }

    // Salvar no Supabase
    const { data, error } = await supabaseServer
      .from('leads_roleta')
      .insert([{ nome, numero }])
      .select();

    if (error) {
      console.error('Erro ao salvar no Supabase:', error);
      return NextResponse.json(
        { error: 'Erro ao salvar os dados' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro na API de registro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 