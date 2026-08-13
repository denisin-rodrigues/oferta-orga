import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

interface Analise {
  id: string
  nome_especialista: string
  email: string | null
  secao: string
  observacoes: string
  created_at: string
}

async function getAnalises(): Promise<Analise[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase
    .from('analises')
    .select('*')
    .order('created_at', { ascending: false })
  return (data as Analise[]) ?? []
}

const SECAO_COLORS: Record<string, string> = {
  'Dossiê do Avatar':      '#3B82F6',
  'Versão A — Sem VSL':    '#8B5CF6',
  'Versão B — Com VSL':    '#F59E0B',
  'Geral (todas as páginas)': '#10B981',
}

export default async function VerAnalises() {
  const analises = await getAnalises()

  return (
    <div style={{ minHeight: '100vh', background: '#080B14', color: '#F1F5F9', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <a href="/" style={{ fontSize: 13, color: '#F59E0B', textDecoration: 'none' }}>
            ← Voltar ao portal
          </a>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 16, marginBottom: 8, color: '#F1F5F9' }}>
            Análises Recebidas
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
            {analises.length === 0
              ? 'Nenhuma análise recebida ainda.'
              : `${analises.length} análise${analises.length > 1 ? 's' : ''} recebida${analises.length > 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Empty state */}
        {analises.length === 0 && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '48px 32px', textAlign: 'center', color: '#475569' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
            <div style={{ fontSize: 15 }}>Aguardando análise do especialista.</div>
            <div style={{ fontSize: 13, marginTop: 8 }}>Compartilhe o link do portal para receber as análises.</div>
          </div>
        )}

        {/* Analises list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {analises.map((a, i) => {
            const cor = SECAO_COLORS[a.secao] ?? '#64748B'
            const data = new Date(a.created_at).toLocaleDateString('pt-BR', {
              day: '2-digit', month: '2-digit', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })
            return (
              <div
                key={a.id}
                style={{
                  background: '#0D1120',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                {/* Color bar */}
                <div style={{ height: 3, background: cor }} />

                {/* Card content */}
                <div style={{ padding: '20px 24px' }}>
                  {/* Meta */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9' }}>
                        {i + 1}. {a.nome_especialista}
                      </div>
                      {a.email && (
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{a.email}</div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{
                        display: 'inline-block',
                        background: `${cor}20`,
                        color: cor,
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: 20,
                        border: `1px solid ${cor}40`,
                      }}>
                        {a.secao}
                      </span>
                      <div style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>{data}</div>
                    </div>
                  </div>

                  {/* Observações */}
                  <div style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: '#CBD5E1',
                    whiteSpace: 'pre-wrap',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 8,
                    padding: '14px 16px',
                  }}>
                    {a.observacoes}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {analises.length > 0 && (
          <p style={{ fontSize: 12, color: '#334155', textAlign: 'center', marginTop: 40 }}>
            As análises são exibidas da mais recente para a mais antiga.
          </p>
        )}
      </div>
    </div>
  )
}
