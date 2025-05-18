import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { nome_lead, numero_lead, premio, investimento, lider_caravana } = await request.json();

    if (!nome_lead || !numero_lead || !premio) {
      return NextResponse.json(
        { error: 'Nome, número e prêmio são obrigatórios' },
        { status: 400 }
      );
    }

    // Salvar no Supabase
    const { data, error } = await supabaseServer
      .from('roleta_conquista')
      .insert([
        {
          nome_lead,
          numero_lead,
          premio,
          investimento: investimento || '',
          lider_caravana: lider_caravana || ''
        }
      ])
      .select();

    if (error) {
      console.error('Erro ao salvar prêmio no Supabase:', error);
      return NextResponse.json(
        { error: 'Erro ao salvar o prêmio' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro na API de prêmio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 