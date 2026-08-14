'use client'

import { useState, useEffect } from 'react'

const TABS = [
  { id: 'dossie',   label: 'Dossiê do Avatar',      src: '/dossie.html',   secao: 'Dossiê do Avatar'      },
  { id: 'versao-a', label: 'Versão A — Sem VSL',     src: '/versao-a.html', secao: 'Versão A — Sem VSL'    },
  { id: 'versao-b', label: 'Versão B — Com VSL',     src: '/versao-b.html', secao: 'Versão B — Com VSL'    },
  { id: 'versao-c', label: 'Versão C — Otimizada',   src: '/versao-c.html', secao: 'Versão C — Otimizada'  },
]

const SECOES = [
  'Geral (todas as páginas)',
  'Dossiê do Avatar',
  'Versão A — Sem VSL',
  'Versão B — Com VSL',
  'Versão C — Otimizada',
]

type Status = 'idle' | 'sending' | 'ok' | 'error'

export default function Portal() {
  const [activeTab, setActiveTab] = useState('dossie')
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({
    nome: '',
    email: '',
    secao: 'Dossiê do Avatar',
    observacoes: '',
  })

  // Sync section dropdown with active tab
  useEffect(() => {
    const tab = TABS.find(t => t.id === activeTab)
    if (tab) setForm(f => ({ ...f, secao: tab.secao }))
  }, [activeTab])

  const activeDoc = TABS.find(t => t.id === activeTab)!

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_especialista: form.nome,
          email: form.email || null,
          secao: form.secao,
          observacoes: form.observacoes,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('ok')
      setForm(f => ({ ...f, observacoes: '' }))
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#080B14', color: '#F1F5F9', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style jsx>{`
        .tabs-row {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .tabs-row::-webkit-scrollbar { display: none; }
        .tabs-row button { flex-shrink: 0; }

        @media (max-width: 860px) {
          .app-header {
            flex-wrap: wrap;
            gap: 10px;
            padding: 14px 16px !important;
          }
          .app-body {
            flex-direction: column !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
          }
          .doc-col {
            flex: none !important;
          }
          .doc-iframe {
            flex: none !important;
            height: 65vh;
            min-height: 420px;
          }
          .feedback-panel {
            width: 100% !important;
            flex-shrink: 0 !important;
            border-left: none !important;
            border-top: 1px solid rgba(255,255,255,0.08);
          }
          .feedback-form {
            overflow-y: visible !important;
          }
        }
      `}</style>

      {/* ─── Header ─── */}
      <header className="app-header" style={{ flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0D1120' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#F59E0B', textTransform: 'uppercase', marginBottom: 2 }}>
            Reset Semanal
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#F1F5F9' }}>
            Portal de Revisão Especializada
          </div>
        </div>
        <a
          href="/ver-analises"
          style={{ fontSize: 12, color: '#64748B', textDecoration: 'none', borderRadius: 6, padding: '6px 12px', border: '1px solid rgba(255,255,255,0.08)', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#F59E0B')}
          onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
        >
          Ver análises recebidas →
        </a>
      </header>

      {/* ─── Body ─── */}
      <div className="app-body" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ─── Left: Document viewer ─── */}
        <div className="doc-col" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Tabs */}
          <div className="tabs-row" style={{ flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '10px 16px', display: 'flex', gap: 6, background: '#0A0E1A' }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: activeTab === tab.id ? '#F59E0B' : 'transparent',
                  color: activeTab === tab.id ? '#000' : '#94A3B8',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (activeTab !== tab.id) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                }}
                onMouseLeave={e => {
                  if (activeTab !== tab.id) e.currentTarget.style.background = 'transparent'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Iframe */}
          <iframe
            key={activeTab}
            className="doc-iframe"
            src={activeDoc.src}
            style={{ flex: 1, width: '100%', border: 'none' }}
            title={activeDoc.label}
          />
        </div>

        {/* ─── Right: Feedback panel ─── */}
        <div className="feedback-panel" style={{ width: 380, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', background: '#0D1120' }}>

          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9', marginBottom: 4 }}>
              Sua Análise
            </div>
            <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>
              Descreva o que mudaria, o que funciona, o que pode melhorar. Você pode enviar uma análise por seção.
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="feedback-form"
            style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {/* Nome */}
            <div>
              <label style={labelStyle}>Nome do especialista *</label>
              <input
                type="text"
                required
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                placeholder="Seu nome completo"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = '#F59E0B')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')}
              />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>E-mail (opcional)</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="seu@email.com"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = '#F59E0B')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')}
              />
            </div>

            {/* Seção */}
            <div>
              <label style={labelStyle}>Seção analisada *</label>
              <select
                value={form.secao}
                onChange={e => setForm(f => ({ ...f, secao: e.target.value }))}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#F59E0B')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')}
              >
                {SECOES.map(s => (
                  <option key={s} value={s} style={{ background: '#0D1120' }}>{s}</option>
                ))}
              </select>
            </div>

            {/* Observações */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>Observações e sugestões *</label>
              <textarea
                required
                value={form.observacoes}
                onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
                placeholder="Descreva sua análise em detalhes: o que mudaria na copy, no posicionamento, nos preços, na estrutura, nas seções... Quanto mais detalhado, melhor."
                style={{ ...inputStyle, minHeight: 180, resize: 'vertical', flex: 1 }}
                onFocus={e => (e.currentTarget.style.borderColor = '#F59E0B')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')}
              />
            </div>

            {/* Feedback messages */}
            {status === 'ok' && (
              <div style={{ background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#4ADE80' }}>
                ✓ Análise enviada com sucesso! Obrigado pela contribuição.
              </div>
            )}
            {status === 'error' && (
              <div style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#F87171' }}>
                Erro ao enviar. Verifique sua conexão e tente novamente.
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'sending'}
              style={{
                width: '100%',
                background: status === 'sending' ? '#92400E' : '#F59E0B',
                color: '#000',
                fontWeight: 700,
                fontSize: 14,
                padding: '12px 0',
                borderRadius: 8,
                border: 'none',
                cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
                opacity: status === 'sending' ? 0.7 : 1,
              }}
            >
              {status === 'sending' ? 'Enviando...' : 'Enviar análise'}
            </button>

            <p style={{ fontSize: 11, color: '#475569', textAlign: 'center', margin: 0 }}>
              Você pode enviar múltiplas análises — uma por seção.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: '#64748B',
  marginBottom: 6,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 8,
  padding: '9px 12px',
  fontSize: 13,
  color: '#F1F5F9',
  outline: 'none',
  transition: 'border-color 0.15s',
  fontFamily: 'inherit',
}
