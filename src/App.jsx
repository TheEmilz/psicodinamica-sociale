import { useState, Fragment } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Header from './components/Header'
import { ScrollReveal } from './components/ScrollReveal'
import { itemSpring, wordSpring } from './components/springVariants'
import { scrollToSection } from './utils/scroll'
import imgCose from './assets/img-cose.svg'
import imgComeFunziona from './assets/img-come-funziona.svg'
import imgTeam from './assets/img-team.svg'
import photoCose from './assets/cose-new.png'
import photoComeFunziona from './assets/come-funziona.png'
import photoTeam from './assets/team.png'
import './index.css'

// ─── StickyCard: card sovrapposte (stacking) senza spazio morto ────────────────
// Ogni card è sticky a top:0 e occupa min 100vh con il contenuto centrato.
// La card successiva scorre subito sopra la precedente: nessun gap.
function StickyCard({ id, headerTheme, zIndex, bgImage, blob, children }) {
  return (
    <section
      id={id}
      data-header-theme={headerTheme}
      className="flex flex-col items-center justify-center"
      style={{
        position: 'sticky', top: 0,
        minHeight: '100vh',
        overflow: 'hidden',
        zIndex,
        backgroundColor: '#f5f5f5',
        backgroundImage: bgImage,
        borderRadius: '32px',
        margin: '0 10px',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.08)',
      }}
    >
      {blob}
      <div className="relative z-10 flex flex-col items-center text-center px-4 py-16 md:py-20 w-full">
        {children}
      </div>
    </section>
  )
}

// ─── CardImage: foto sfumata che si fonde nel colore della card ─────────────────
// Forma organica (no rettangolo) + bordi piumati molto morbidi + velo di colore
// a tema + linee allungate decorative che escono dai bordi. Fallback all'SVG.
const LINE_SETS = {
  // ogni set ha una disposizione diversa di curve + punti, così le foto non si somigliano
  green: {
    paths: [
      'M-20 70 Q30 38 120 30',
      'M-16 86 Q40 58 118 52',
      'M-24 54 Q26 24 112 8',
    ],
    dots: [[120, 30], [-20, 70], [112, 8]],
  },
  orange: {
    paths: [
      'M120 64 Q70 26 -22 18',
      'M118 82 Q64 50 -18 46',
      'M122 44 Q74 14 -10 -4',
    ],
    dots: [[-22, 18], [120, 64], [-10, -4]],
  },
  indigo: {
    paths: [
      'M-22 22 Q50 8 120 70',
      'M-14 6 Q60 30 116 86',
      'M-20 44 Q40 46 122 30',
    ],
    dots: [[120, 70], [-22, 22], [122, 30]],
  },
}

function CardImage({ src, fallback, alt, tint, variant, photoBg }) {
  const [errored, setErrored] = useState(false)
  // colore di fondo dell'illustrazione: la foto si dissolve in un alone identico,
  // così il bordo del rettangolo sparisce e le figure "emergono" dal colore.
  const halo = photoBg || tint
  // maschera morbida: il centro resta pieno, i bordi sfumano dolcemente
  const feather = 'radial-gradient(ellipse 92% 94% at 50% 48%, #000 62%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.25) 94%, transparent 100%)'
  // maschera che spegne le linee man mano che escono dalla foto
  const lineMask = 'radial-gradient(ellipse 50% 50% at 50% 46%, #000 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0.25) 70%, transparent 100%)'
  const set = LINE_SETS[variant] || LINE_SETS.green
  const gradId = `ln-${variant}`
  return (
    <div className="relative w-full select-none" style={{ aspectRatio: '4 / 5' }}>
      {/* alone dello stesso colore del fondo foto: si estende oltre il rettangolo
          e sfuma nella card, eliminando lo stacco netto */}
      <div
        aria-hidden="true"
        className="absolute"
        style={{
          inset: '-9%',
          background: `radial-gradient(ellipse 68% 70% at 50% 48%, ${halo} 40%, ${halo}cc 60%, ${halo}00 82%)`,
          filter: 'blur(10px)',
          pointerEvents: 'none',
        }}
      />
      {/* linee allungate decorative che sfumano molto oltre i bordi */}
      <svg
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          inset: '-30%', width: '160%', height: '160%',
          WebkitMaskImage: lineMask, maskImage: lineMask,
        }}
        viewBox="0 0 100 100"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={tint} stopOpacity="0" />
            <stop offset="50%" stopColor={tint} stopOpacity="0.55" />
            <stop offset="100%" stopColor={tint} stopOpacity="0" />
          </linearGradient>
        </defs>
        {set.paths.map((d, i) => (
          <path key={i} d={d} stroke={`url(#${gradId})`} strokeWidth={0.6 - i * 0.1} strokeLinecap="round" />
        ))}
        {set.dots.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={0.9 - i * 0.2} fill={tint} fillOpacity={0.55 - i * 0.12} />
        ))}
      </svg>
      <img
        src={errored ? fallback : src}
        alt={alt}
        loading="lazy"
        onError={() => setErrored(true)}
        className="relative w-full h-full"
        style={{
          objectFit: 'cover',
          borderRadius: '18px',
          WebkitMaskImage: feather,
          maskImage: feather,
        }}
      />
      {/* velo soft-light per uniformare luce/colore con la card */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 50% 48%, ${tint} 0%, transparent 70%)`,
          mixBlendMode: 'soft-light',
          opacity: 0.5,
          WebkitMaskImage: feather,
          maskImage: feather,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

// ─── CardDecor: decorazione "onde di ascolto" in fondo a ogni card ──────────────
// Riempie lo spazio vuoto tra il contenuto e la card successiva con un motivo
// elegante e calmo, colorato a tema. Puramente decorativo.
function CardDecor({ color }) {
  return (
    <div aria-hidden="true" className="mt-14 md:mt-20 mb-4 flex flex-col items-center gap-5 select-none">
      <svg width="240" height="64" viewBox="0 0 240 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M80 56 Q120 14 160 56" stroke={color} strokeWidth="1.6" strokeOpacity="0.55" strokeLinecap="round" />
        <path d="M58 56 Q120 -10 182 56" stroke={color} strokeWidth="1.6" strokeOpacity="0.34" strokeLinecap="round" />
        <path d="M36 56 Q120 -34 204 56" stroke={color} strokeWidth="1.6" strokeOpacity="0.18" strokeLinecap="round" />
        <circle cx="120" cy="56" r="3.5" fill={color} fillOpacity="0.85" />
        <circle cx="80" cy="56" r="2.2" fill={color} fillOpacity="0.45" />
        <circle cx="160" cy="56" r="2.2" fill={color} fillOpacity="0.45" />
        <circle cx="58" cy="56" r="1.6" fill={color} fillOpacity="0.28" />
        <circle cx="182" cy="56" r="1.6" fill={color} fillOpacity="0.28" />
      </svg>
      <span style={{ width: '54px', height: '1px', background: color, opacity: 0.25 }} />
    </div>
  )
}

// ─── Booking form component ─────────────────────────────────────────────────────
// Sito statico (GitHub Pages): l'invio passa da Web3Forms, che recapita il
// messaggio alla casella del team senza aprire il client di posta dell'utente.
const CONTACT_EMAIL = 'silviaisid@gmail.com'
const WEB3FORMS_KEY = '5af21dfc-2a75-4492-b084-5c3ede38d9be'

function BookingSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [contactConsent, setContactConsent] = useState(false)
  const [status, setStatus] = useState(null) // 'sending' | 'ok' | 'error'

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Richiesta colloquio — ${form.name || 'Nuovo contatto'}`,
          from_name: 'Psicodinamica Sociale — Sito',
          name: form.name,
          email: form.email,
          phone: form.phone || '—',
          message: form.message || '—',
          botcheck: '',
        }),
      })
      const data = await res.json()
      setStatus(data.success ? 'ok' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(37,99,235,0.18)',
    background: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    color: '#1f2937',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
  }

  const consentLabelStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '11px',
    lineHeight: 1.5,
    color: '#6b7280',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  }

  const consentCheckboxStyle = {
    width: '16px',
    height: '16px',
    marginTop: '1px',
    flexShrink: 0,
    accentColor: '#1a3a6e',
    cursor: 'pointer',
  }

  const tabActive = {
    background: '#1a3a6e',
    color: '#fff',
    borderRadius: '20px',
    padding: '8px 24px',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
  }
  return (
    <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
      {status === 'ok' && (
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#065f46', fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>
          ✓ Richiesta inviata correttamente! Ti ricontatteremo al più presto. Se preferisci, puoi scriverci anche a {CONTACT_EMAIL}.
        </div>
      )}
      {status === 'error' && (
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#991b1b', fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>
          Si è verificato un errore. Riprova o scrivici direttamente.
        </div>
      )}

      {status !== 'ok' && (
        <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input required style={inputStyle} placeholder="Nome e Cognome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input required type="email" style={inputStyle} placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <input type="tel" style={inputStyle} placeholder="Telefono (opzionale)" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Messaggio (opzionale)" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
          <label style={consentLabelStyle}>
            <input
              type="checkbox"
              required
              checked={contactConsent}
              onChange={e => setContactConsent(e.target.checked)}
              style={consentCheckboxStyle}
            />
            <span>
              Ho letto l'<a href="#/privacy" style={{ color: '#1a3a6e', textDecoration: 'underline' }}>informativa privacy</a> e acconsento al trattamento dei miei dati personali ai sensi del GDPR (Reg. UE 2016/679).
            </span>
          </label>
          <button
            type="submit"
            disabled={!contactConsent || status === 'sending'}
            style={{ ...tabActive, width: '100%', padding: '14px', borderRadius: '24px', fontSize: '12px', opacity: (!contactConsent || status === 'sending') ? 0.6 : 1 }}
          >
            {status === 'sending' ? 'Invio in corso…' : 'Invia il messaggio'}
          </button>
          <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#9ca3af', margin: '6px 0 0' }}>
            Le disponibilità a tariffa sociale sono limitate: rappresentano una scelta precisa da parte dei professionisti del team, che hanno voluto riservare una parte del proprio lavoro a chi si trova in un momento di difficoltà e non ha molte risorse economiche. È un'occasione, non una concessione.
          </p>
        </form>
      )}
    </div>
  )
}

export default function App() {
  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <Header />

      {/* ══ HERO — off-white, full viewport ═══════════════════════ */}
      <section
        id="home"
        data-header-theme="light"
        className="relative flex flex-col items-center min-h-screen text-center px-6 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1e3a8a 0%, #1a3a6e 55%, #14306b 100%)', position: 'sticky', top: 0, zIndex: 1 }}
      >
        {/* Radial glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(239,68,68,0.16) 0%, rgba(255,255,255,0.05) 50%, transparent 80%)',
          }}
        />
        {/* Grid pattern */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 85% 80% at 50% 50%, black 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 85% 80% at 50% 50%, black 30%, transparent 100%)',
            pointerEvents: 'none', zIndex: 0,
          }}
        />
        <ScrollReveal className="flex flex-1 flex-col items-center justify-center max-w-2xl relative z-10" style={{ paddingTop: '88px', paddingBottom: '12px' }}>
          <motion.p
            variants={itemSpring}
            className="text-sm md:text-base font-semibold tracking-[0.3em] uppercase mb-4"
            style={{ color: '#b3175a' }}
          >
            Psicoterapia Psicodinamica ·{' '}
            <span style={{ position: 'relative', display: 'inline-block', color: '#ffffff' }}>
              <strong style={{ fontWeight: 800 }}>Online</strong>
              <svg
                aria-hidden="true"
                viewBox="0 0 100 14"
                preserveAspectRatio="none"
                style={{ position: 'absolute', left: '-4%', bottom: '-9px', width: '108%', height: '11px', overflow: 'visible' }}
              >
                <path d="M2 10 Q50 0 98 10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
            </span>
          </motion.p>
          <motion.h1
            variants={itemSpring}
            className="mb-5 text-center" style={{ lineHeight: '1.02', fontSize: 'clamp(2.4rem, 11vw, 6rem)' }}
          >
            <span className="hero-name">Psicoterapia<br />Psicodinamica<br />Sociale</span>
          </motion.h1>
          <motion.p
            variants={itemSpring}
            className="text-lg leading-relaxed mb-6 text-center max-w-md"
            style={{ color: 'rgba(255,255,255,0.82)' }}
          >
            Un percorso di psicoterapia psicodinamica accessibile a tutti.
            Sedute individuali <strong style={{ color: '#ffffff' }}>online</strong> a <strong style={{ color: '#fca5a5' }}>40€</strong>.
          </motion.p>
          <motion.div variants={itemSpring} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
            <motion.a
              href="#prenota"
              onClick={(e) => { e.preventDefault(); scrollToSection('#prenota') }}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase px-8 py-4 text-white hover:opacity-90 transition-opacity"
              style={{ borderRadius: '24px', background: '#dc2626' }}
            >
              Prenota ora
            </motion.a>
            <motion.a
              href="#cos-e"
              onClick={(e) => { e.preventDefault(); scrollToSection('#cos-e') }}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase px-8 py-4 hover:opacity-80 transition-opacity"
              style={{ borderRadius: '24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: '#ffffff' }}
            >
              Scopri di più
            </motion.a>
          </motion.div>
          <motion.p
            variants={itemSpring}
            className="text-xs mt-2 animate-bounce"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            ↓ scorri
          </motion.p>
        </ScrollReveal>
      </section>

      {/* ══ COS'È — blu ══════════════════════════════════════════ */}
      <StickyCard
        id="cos-e"
        headerTheme="blue"
        zIndex={2}
        bgImage="linear-gradient(160deg, rgba(23,52,160,0.62) 0%, rgba(29,78,216,0.34) 55%, transparent 100%)"
        blob={
          <div aria-hidden="true" style={{
            position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.13) 0%, transparent 65%)',
            top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none',
          }} />
        }
      >
        <ScrollReveal className="flex flex-col md:flex-row items-center gap-6 md:gap-12 max-w-5xl w-full">
          <motion.div variants={itemSpring} className="hidden md:block w-full md:w-1/2 shrink-0">
            <CardImage
              src={photoCose}
              fallback={imgCose}
              alt="Psicoterapia psicodinamica"
              tint="#2563eb"
              photoBg="#9C95D4"
              variant="green"
            />
          </motion.div>
          <div className="flex flex-col w-full md:w-1/2 text-left">
            <motion.p variants={itemSpring} className="text-xs font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: '#2563eb' }}>
              La psicoterapia psicodinamica
            </motion.p>
            <motion.h2
              variants={itemSpring}
              className="text-2xl md:text-4xl font-medium leading-tight mb-4"
              style={{ color: '#2f2f2f' }}
            >
              Cos&apos;è la Psicoterapia<br />Psicodinamica
            </motion.h2>
            <motion.p variants={itemSpring} className="text-sm leading-relaxed mb-3" style={{ color: '#4b5563' }}>
              La psicoterapia psicodinamica nasce dal pensiero di Sigmund Freud e si è sviluppata nel corso del Novecento attraverso il contributo di molti clinici e teorici — da Melanie Klein a Donald Winnicott, da Wilfred Bion a Jacques Lacan — che ne hanno ampliato e trasformato i fondamenti.{' '}
              <Link to="/cos-e" className="md:hidden" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'underline' }}>continua a leggere →</Link>
            </motion.p>
            <motion.p variants={itemSpring} className="hidden md:block text-sm leading-relaxed mb-3" style={{ color: '#4b5563' }}>
              Il suo presupposto centrale è che una parte rilevante della nostra vita psichica sia inconscia: desideri, conflitti, emozioni e memorie che non sono direttamente accessibili alla coscienza, ma che orientano profondamente il nostro modo di stare al mondo, di amare, di soffrire.
            </motion.p>
            <motion.p variants={itemSpring} className="hidden md:block text-sm leading-relaxed mb-6" style={{ color: '#4b5563' }}>
              La psicoterapia psicodinamica lavora attraverso la parola e la relazione. Non si concentra solo sul sintomo, ma cerca di esplorare il significato che quel sintomo porta con sé. Il disagio non viene eliminato, ma <strong style={{ color: '#2f2f2f' }}>ascoltato, e attraverso quell&apos;ascolto, trasformato</strong>.{' '}
              <Link to="/cos-e" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'underline' }}>continua a leggere →</Link>
            </motion.p>
            <motion.div variants={itemSpring} className="flex gap-4 flex-wrap">
              <motion.a
                href="#prenota"
                onClick={(e) => { e.preventDefault(); scrollToSection('#prenota') }}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase px-8 py-4 text-white hover:opacity-80 transition-opacity"
                style={{ borderRadius: '24px', background: '#2563eb' }}
              >
                Inizia il percorso — 40€ a seduta
              </motion.a>
            </motion.div>
          </div>
        </ScrollReveal>
        <CardDecor color="#2563eb" />
      </StickyCard>

      {/* ══ COME FUNZIONA — orange pill ══════════════════════════════════ */}
      <StickyCard
        id="come-funziona"
        headerTheme="blue"
        zIndex={3}
        bgImage="linear-gradient(160deg, rgba(40,56,168,0.64) 0%, rgba(55,80,210,0.34) 55%, transparent 100%)"
        blob={
          <div aria-hidden="true" style={{
            position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,106,232,0.14) 0%, transparent 65%)',
            top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none',
          }} />
        }
      >
        <ScrollReveal className="flex flex-col md:flex-row items-center gap-6 md:gap-12 max-w-5xl w-full">
          <motion.div variants={itemSpring} className="hidden md:block w-full md:w-1/2 shrink-0">
            <CardImage
              src={photoComeFunziona}
              fallback={imgComeFunziona}
              alt="Come funziona il percorso"
              tint="#4f6ae8"
              photoBg="#4A80C7"
              variant="orange"
            />
          </motion.div>
          <div className="flex flex-col w-full md:w-1/2 text-left">
            <motion.p variants={itemSpring} className="text-xs font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: '#4f6ae8' }}>
              Come funziona
            </motion.p>
            <motion.h2
              variants={itemSpring}
              className="text-2xl md:text-4xl font-medium leading-tight mb-4"
              style={{ color: '#2f2f2f' }}
            >
              Come Funziona<br />il Percorso
            </motion.h2>
            <motion.p variants={itemSpring} className="text-sm leading-relaxed mb-4" style={{ color: '#4b5563' }}>
              Si parte da un primo colloquio libero: nessuna domanda giusta o sbagliata, nessuna pressione. Si racconta la propria storia e insieme si valuta il percorso più adeguato. Frequenza e durata delle sedute vengono concordate, e si è sempre liberi di scegliere.{' '}
              <Link to="/come-funziona" style={{ color: '#4f6ae8', fontWeight: 600, textDecoration: 'underline' }}>continua a leggere →</Link>
            </motion.p>
            <motion.div variants={itemSpring} style={{ padding: '14px 20px', borderRadius: '20px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(79,106,232,0.22)', marginBottom: '16px', width: '100%' }}>
              <p style={{ fontSize: '24px', fontWeight: 600, color: '#4f6ae8', fontFamily: "'Cormorant Garamond', serif", margin: 0 }}>40€ a seduta · 50 minuti</p>
            </motion.div>
            <motion.div variants={itemSpring} className="flex gap-4 flex-wrap">
              <motion.a
                href="#prenota"
                onClick={(e) => { e.preventDefault(); scrollToSection('#prenota') }}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase px-8 py-4 text-white hover:opacity-80 transition-opacity"
                style={{ borderRadius: '24px', background: '#4f6ae8' }}
              >
                Prenota ora — 40€ a seduta
              </motion.a>
            </motion.div>
          </div>
        </ScrollReveal>
        <CardDecor color="#4f6ae8" />
      </StickyCard>

      {/* ══ IL TEAM — indigo pill ═══════════════════════════════════════ */}
      <StickyCard
        id="il-team"
        headerTheme="indigo"
        zIndex={4}
        bgImage="linear-gradient(160deg, rgba(67,52,180,0.62) 0%, rgba(91,77,224,0.34) 55%, transparent 100%)"
        blob={
          <div aria-hidden="true" style={{
            position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(123,110,242,0.13) 0%, transparent 65%)',
            top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none',
          }} />
        }
      >
        <ScrollReveal className="flex flex-col md:flex-row items-center gap-6 md:gap-12 max-w-5xl w-full">
          <motion.div variants={itemSpring} className="hidden md:block w-full md:w-1/2 shrink-0">
            <CardImage
              src={photoTeam}
              fallback={imgTeam}
              alt="Il nostro team"
              tint="#7b6ef2"
              photoBg="#0081CC"
              variant="indigo"
            />
          </motion.div>
          <div className="flex flex-col w-full md:w-1/2 text-left">
            <motion.p variants={itemSpring} className="text-xs font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: '#7b6ef2' }}>
              Chi siamo
            </motion.p>
            <motion.h2
              variants={itemSpring}
              className="text-2xl md:text-4xl font-medium leading-tight mb-4"
              style={{ color: '#2f2f2f' }}
            >
              Il Nostro Team
            </motion.h2>
            <motion.p variants={itemSpring} className="text-sm leading-relaxed mb-4" style={{ color: '#4b5563' }}>
              Siamo psicoterapeuti di formazione psicodinamica con più di dieci anni di esperienza clinica e un lungo percorso di analisi personale. Lavoriamo online, con cura e con metodo e crediamo che la qualità di un percorso terapeutico non debba essere un privilegio, né una questione di geografia o di disponibilità economica. La cura dovrebbe essere alla portata di chi ne ha bisogno.
            </motion.p>
            <motion.p variants={itemSpring} className="hidden md:block text-sm leading-relaxed mb-8" style={{ color: '#4b5563' }}>
              Il team vanta una consolidata esperienza clinica nei disturbi del comportamento alimentare, nelle dipendenze, nei disturbi dell&apos;umore, nei disturbi d&apos;ansia e ossessivi, nella presa in carico di quadri clinici complessi, inclusi i disturbi di personalità e le forme di psicopatologia grave.
            </motion.p>
            <motion.div variants={itemSpring} className="w-full mb-4 md:mb-8">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#5b4de0' }}>Aree di expertise</p>
              <div className="flex flex-wrap gap-2.5">
                {["Disturbi alimentari", "Dipendenze", "Disturbi dell'umore", "Ansia e OCD", "Disturbi di personalità", "Traumi complessi", "Relazioni difficili", "Disabilità", "LGBTQ+"].map(area => (
                  <Fragment key={area}>
                    {area === "Disabilità" && <div style={{ flexBasis: '100%', height: 0 }} aria-hidden="true" />}
                    <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.02em', padding: '8px 18px', borderRadius: '22px', background: 'rgba(91,77,224,0.10)', border: '1px solid rgba(91,77,224,0.28)', color: '#3730a3' }}>{area}</span>
                  </Fragment>
                ))}
              </div>
            </motion.div>
            <motion.a
              variants={itemSpring}
              href="#prenota"
              onClick={(e) => { e.preventDefault(); scrollToSection('#prenota') }}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase px-8 py-4 text-white hover:opacity-80 transition-opacity"
              style={{ borderRadius: '24px', background: '#7b6ef2' }}
            >
              Prenota ora — 40€ a seduta
            </motion.a>
          </div>
        </ScrollReveal>
        <CardDecor color="#7b6ef2" />
      </StickyCard>

      {/* ══ PRENOTA — blue pill ═══════════════════════════════════════════ */}
      <section
        id="prenota"
        data-header-theme="indigo"
        className="relative flex flex-col items-center justify-center text-center"
        style={{
          backgroundColor: '#f5f5f5',
          backgroundImage: 'linear-gradient(160deg, rgba(94,62,200,0.64) 0%, rgba(124,92,236,0.36) 55%, transparent 100%)',
          borderRadius: '60px',
          margin: '0 20px',
          padding: '100px 16px 80px',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 5,
          boxShadow: '0 -20px 60px rgba(0,0,0,0.12)',
        }}
      >
        <div aria-hidden="true" style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.14) 0%, transparent 65%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
        <ScrollReveal className="flex flex-col items-center relative z-10 w-full max-w-xl">
          <motion.p variants={itemSpring} className="text-xs font-semibold tracking-[0.3em] uppercase mb-6" style={{ color: '#8b5cf6' }}>
            Inizia oggi
          </motion.p>
          <motion.h2
            variants={itemSpring}
            className="text-4xl md:text-6xl font-medium leading-tight mb-4 text-center"
            style={{ color: '#4c2f7f' }}
          >
            Prenota una Seduta
          </motion.h2>
          <motion.p variants={itemSpring} className="text-base leading-relaxed mb-6 text-center max-w-md" style={{ color: '#6b7280' }}>
            Lascia il tuo contatto e verrai ricontattato entro 24 ore.
          </motion.p>
          <motion.p variants={itemSpring} className="text-sm leading-relaxed mb-10 text-center max-w-lg" style={{ color: '#8b87a8' }}>
            Per verificare le disponibilità e prenotare il primo colloquio è possibile scrivere nella sezione contatti per essere ricontattati via email entro le 24 ore. Qualora non vi fosse disponibilità al momento della richiesta, è possibile inserirsi in lista d&apos;attesa e si verrà contattati non appena un professionista tornerà disponibile.
          </motion.p>
          <motion.div variants={itemSpring} style={{ width: '100%' }}>
            <BookingSection />
          </motion.div>
        </ScrollReveal>
      </section>

      {/* ══ LAVORA CON NOI ═══════════════════════════════ */}
      <section
        id="lavora-con-noi"
        data-header-theme="indigo"
        className="relative flex flex-col items-center justify-center text-center"
        style={{
          backgroundColor: '#f5f5f5',
          backgroundImage: 'linear-gradient(160deg, rgba(67,52,180,0.55) 0%, rgba(91,77,224,0.28) 55%, transparent 100%)',
          borderRadius: '60px',
          margin: '0 20px 20px',
          padding: '90px 16px 80px',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 6,
          boxShadow: '0 -20px 60px rgba(0,0,0,0.10)',
        }}
      >
        <div aria-hidden="true" style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,110,242,0.13) 0%, transparent 65%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
        <ScrollReveal className="flex flex-col items-center relative z-10 w-full max-w-2xl">
          <motion.p variants={itemSpring} className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: '#7b6ef2' }}>
            Lavora con noi
          </motion.p>
          <motion.h2 variants={itemSpring} className="text-3xl md:text-5xl font-medium leading-tight mb-6 text-center" style={{ color: '#2f2f2f' }}>
            Lavora con Noi
          </motion.h2>
          <motion.p variants={itemSpring} className="text-sm md:text-base leading-relaxed mb-4 text-center" style={{ color: '#4b5563' }}>
            Il progetto nasce con l&apos;intenzione di crescere, e possono aprirsi spazi per nuove collaborazioni. Se sei uno psicoterapeuta di formazione psicodinamica con almeno dieci anni di esperienza clinica, un percorso di almeno 5 anni di analisi personale e una pratica continuativa di supervisione, puoi inviare la tua candidatura tramite il form di contatto.
          </motion.p>
          <motion.p variants={itemSpring} className="text-sm md:text-base leading-relaxed mb-8 text-center" style={{ color: '#4b5563' }}>
            Ciò che cerchiamo non si esaurisce nella competenza tecnica. Crediamo che fare bene questo lavoro significhi prima di tutto averlo esperito su se stessi — che la psicoterapia non sia soltanto un mestiere, ma un modo di stare nel mondo e in relazione. L&apos;analisi personale, in questo senso, non è un requisito formale: è la condizione che rende possibile tutto il resto.
          </motion.p>
          <motion.div variants={itemSpring}>
            <Link
              to="/lavora-con-noi"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase px-8 py-4 text-white hover:opacity-80 transition-opacity"
              style={{ borderRadius: '24px', background: '#7b6ef2', textDecoration: 'none' }}
            >
              Invia la tua candidatura
            </Link>
          </motion.div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer style={{ background: '#f5f5f5', padding: '8px 20px 28px', position: 'relative', zIndex: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(99,102,241,0.14)',
            borderRadius: '28px',
            boxShadow: '0 8px 32px rgba(99,102,241,0.08)',
            padding: '36px 32px 30px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 600, color: '#2f2f2f', lineHeight: 1 }}>
              Psicodinamica Sociale
            </span>
            <span style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9ca3af' }}>
              Psicoterapia psicodinamica online
            </span>
          </div>

          <nav style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 22px' }}>
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('#home') }} style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', textDecoration: 'none', cursor: 'pointer' }}>Home</a>
            <a href="#cos-e" onClick={(e) => { e.preventDefault(); scrollToSection('#cos-e') }} style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', textDecoration: 'none', cursor: 'pointer' }}>Cos&apos;è</a>
            <a href="#come-funziona" onClick={(e) => { e.preventDefault(); scrollToSection('#come-funziona') }} style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', textDecoration: 'none', cursor: 'pointer' }}>Come funziona</a>
            <a href="#prenota" onClick={(e) => { e.preventDefault(); scrollToSection('#prenota') }} style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', textDecoration: 'none', cursor: 'pointer' }}>Prenota</a>
            <a href="#/privacy" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', textDecoration: 'none' }}>Privacy</a>
          </nav>

          <div style={{ width: '100%', maxWidth: '320px', height: '1px', background: 'rgba(99,102,241,0.12)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <p style={{ margin: 0, fontSize: '11px', letterSpacing: '0.06em', color: '#9ca3af' }}>
              © 2026 Psicodinamica Sociale
            </p>
            <p style={{ margin: 0, fontSize: '11px', letterSpacing: '0.06em', color: '#b8b8b8' }}>
              Sito web realizzato da{' '}
              <a href="https://epixiom.io" target="_blank" rel="noopener noreferrer" style={{ color: '#7b6ef2', textDecoration: 'none', fontWeight: 600 }}>
                Epixiom
              </a>
            </p>
          </div>
        </motion.div>
      </footer>
    </div>
  )
}

