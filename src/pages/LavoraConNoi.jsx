import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Casella email del team verso cui recapitare le candidature (fallback mailto).
const CONTACT_EMAIL = 'silviaisid@gmail.com'

export default function LavoraConNoi() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    experience: '', analysis: '', supervision: '', portfolio: '', message: '',
  })
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState(null) // 'ok'

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Lavora con noi · Psicodinamica Sociale'
    return () => { document.title = 'Psicodinamica Sociale' }
  }, [])

  // Sito statico (GitHub Pages): nessun backend. Il modulo apre il client di posta
  // dell'utente precompilato verso la casella del team (fallback mailto).
  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = `Candidatura — ${form.name || 'Nuovo candidato'}`
    const bodyLines = [
      `Nome e Cognome: ${form.name}`,
      `Email: ${form.email}`,
      `Telefono: ${form.phone || '—'}`,
      `Anni di esperienza clinica: ${form.experience || '—'}`,
      `Anni di analisi personale: ${form.analysis || '—'}`,
      `Supervisione continuativa: ${form.supervision || '—'}`,
      `CV / profilo: ${form.portfolio || '—'}`,
      '',
      'Messaggio:',
      form.message || '—',
    ]
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`
    window.location.href = mailto
    setStatus('ok')
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(91,77,224,0.22)',
    background: 'rgba(255,255,255,0.8)',
    fontSize: '14px',
    color: '#1f2937',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
  }

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#5b4de0',
    marginBottom: '6px',
    letterSpacing: '0.02em',
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header back link */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, padding: '20px 40px', background: 'rgba(245,245,245,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(91,77,224,0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5b4de0', textDecoration: 'none' }}
        >
          ← Home
        </Link>
        <span style={{ width: '1px', height: '16px', background: 'rgba(91,77,224,0.2)' }} />
        <span style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#9ca3af', textTransform: 'uppercase' }}>
          Lavora con noi
        </span>
      </header>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '64px 24px 100px' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#5b4de0', marginBottom: '16px' }}
        >
          Unisciti al team
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 500, lineHeight: 1.15, color: '#2f2f2f', marginBottom: '32px' }}
        >
          Lavora con Noi
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}
        >
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#4b5563' }}>
            Il progetto nasce con l'intenzione di crescere, e possono aprirsi spazi per nuove collaborazioni. Se sei uno psicoterapeuta di formazione psicodinamica con almeno dieci anni di esperienza clinica, un percorso di almeno 5 anni di analisi personale e una pratica continuativa di supervisione, puoi inviare la tua candidatura tramite il modulo qui sotto.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#4b5563' }}>
            Ciò che cerchiamo non si esaurisce nella competenza tecnica. Crediamo che fare bene questo lavoro significhi prima di tutto averlo esperito su se stessi — che la psicoterapia non sia soltanto un mestiere, ma un modo di stare nel mondo e in relazione. L'analisi personale, in questo senso, non è un requisito formale: è la condizione che rende possibile tutto il resto.
          </p>
        </motion.div>

        {/* Form candidatura */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.14 }}
          style={{ borderTop: '1px solid rgba(91,77,224,0.2)', paddingTop: '40px' }}
        >
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#5b4de0', marginBottom: '24px' }}>
            Invia la tua candidatura
          </p>

          {status === 'ok' ? (
            <div style={{ padding: '20px', borderRadius: '14px', background: 'rgba(91,77,224,0.08)', border: '1px solid rgba(91,77,224,0.22)', color: '#3730a3', fontSize: '15px', textAlign: 'center' }}>
              ✓ Si è aperto il tuo programma di posta: controlla e premi invia per inoltrare la candidatura. Se non si apre, scrivici a {CONTACT_EMAIL}.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {status === 'error' && (
                <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#991b1b', fontSize: '14px', textAlign: 'center' }}>
                  Si è verificato un errore. Riprova più tardi.
                </div>
              )}

              <div>
                <label style={labelStyle}>Nome e Cognome *</label>
                <input required style={inputStyle} placeholder="Nome e Cognome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input required type="email" style={inputStyle} placeholder="La tua email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Telefono</label>
                  <input type="tel" style={inputStyle} placeholder="Telefono (opzionale)" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
                <div>
                  <label style={labelStyle}>Anni di esperienza clinica</label>
                  <input style={inputStyle} placeholder="Es. 12" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Anni di analisi personale</label>
                  <input style={inputStyle} placeholder="Es. 6" value={form.analysis} onChange={e => setForm(f => ({ ...f, analysis: e.target.value }))} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Supervisione continuativa</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.supervision} onChange={e => setForm(f => ({ ...f, supervision: e.target.value }))}>
                  <option value="">Seleziona…</option>
                  <option value="Sì, in corso">Sì, in corso</option>
                  <option value="In passato">In passato</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>CV o profilo professionale (link)</label>
                <input style={inputStyle} placeholder="Link a CV, sito o profilo (opzionale)" value={form.portfolio} onChange={e => setForm(f => ({ ...f, portfolio: e.target.value }))} />
              </div>

              <div>
                <label style={labelStyle}>Messaggio</label>
                <textarea rows={5} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Raccontaci di te e della tua formazione (opzionale)" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12px', lineHeight: 1.5, color: '#6b7280', textAlign: 'left', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  style={{ width: '16px', height: '16px', marginTop: '2px', flexShrink: 0, accentColor: '#5b4de0', cursor: 'pointer' }}
                />
                <span>
                  Ho letto l'<a href="#/privacy" style={{ color: '#5b4de0', textDecoration: 'underline' }}>informativa privacy</a> e acconsento al trattamento dei miei dati personali ai sensi del GDPR (Reg. UE 2016/679).
                </span>
              </label>

              <button
                type="submit"
                disabled={!consent}
                style={{ width: '100%', padding: '15px', borderRadius: '24px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', border: 'none', color: '#fff', background: '#5b4de0', cursor: 'pointer', opacity: !consent ? 0.6 : 1, transition: 'opacity 0.2s' }}
              >
                Invia la candidatura
              </button>
            </form>
          )}

          <div style={{ marginTop: '32px' }}>
            <Link to="/" style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'none' }}>
              ← Torna alla home
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
