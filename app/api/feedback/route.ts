import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const body = await req.json()
  const { nome_especialista, email, secao, observacoes } = body

  if (!nome_especialista?.trim() || !observacoes?.trim()) {
    return NextResponse.json({ error: 'Nome e observações são obrigatórios.' }, { status: 400 })
  }

  const { error } = await supabase.from('analises').insert({
    nome_especialista: nome_especialista.trim(),
    email: email?.trim() || null,
    secao: secao || 'Geral',
    observacoes: observacoes.trim(),
  })

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
