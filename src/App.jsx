import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
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

// ─── Therapist contacts — contatto diretto e verticale ─────────────────────────
// Nessuna segreteria, nessuna mail unica, nessuna lista d'attesa centralizzata:
// ogni paziente sceglie e contatta direttamente il professionista, che gestisce
// in autonomia il proprio calendario e le proprie tariffe (art. 18 Codice
// Deontologico · esenzione IVA art. 10 n. 18).
const THERAPISTS = [
  { name: 'Dott.ssa [Nome 1]', calendly: 'https://calendly.com/nome1', email: 'nome1@gmail.com' },
  { name: 'Dott.ssa [Nome 2]', calendly: 'https://calendly.com/nome2', email: 'nome2@gmail.com' },
  { name: 'Dott.ssa [Nome 3]', calendly: 'https://calendly.com/nome3', email: 'nome3@gmail.com' },
  { name: 'Dott.ssa [Nome 4]', calendly: 'https://calendly.com/nome4', email: 'nome4@gmail.com' },
]

function TherapistContacts() {
  return (
    <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {THERAPISTS.map(({ name, calendly, email }) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '22px 24px',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.78)',
            border: '1px solid rgba(91,77,224,0.22)',
            textAlign: 'left',
          }}
        >
          <p style={{ fontSize: '20px', fontWeight: 600, color: '#3730a3', margin: 0, fontFamily: "'Cormorant Garamond', serif" }}>{name}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <a
              href={calendly}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '10px 20px', borderRadius: '20px', background: '#5b4de0', color: '#fff', textDecoration: 'none' }}
            >
              Prenota il primo colloquio
            </a>
            <a
              href={`mailto:${email}`}
              style={{ fontSize: '13px', fontWeight: 500, color: '#5b4de0', textDecoration: 'none' }}
            >
              {email}
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── LogoDoor: porta del logo che si chiude in prospettiva al click ───────────
// Anima i vertici del poligono (SVG è 2D: simuliamo la prospettiva spostando
// il bordo libero della porta da "scorciato" a "chiuso a filo").
const DOOR_OPEN = [[55.18, 30.06], [43.37, 33.18], [43.37, 57.81], [55.34, 60.61]]
const DOOR_CLOSED = [[55.18, 30.06], [30.85, 30.06], [30.85, 60.61], [55.34, 60.61]]

function LogoDoor({ closed, onToggle }) {
  const [pts, setPts] = useState(closed ? DOOR_CLOSED : DOOR_OPEN)
  const rafRef = useRef(null)
  const ptsRef = useRef(pts)
  ptsRef.current = pts

  useEffect(() => {
    const from = ptsRef.current.map((p) => [...p])
    const to = closed ? DOOR_CLOSED : DOOR_OPEN
    const duration = 650
    const start = performance.now()
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const e = ease(t)
      setPts(from.map((p, i) => [p[0] + (to[i][0] - p[0]) * e, p[1] + (to[i][1] - p[1]) * e]))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closed])

  const ptStr = pts.map((p) => `${p[0]},${p[1]}`).join(' ')
  return (
    <>
      <polygon className="lp-cls-1" points={ptStr} />
      <rect
        x="30.85"
        y="30.06"
        width="24.33"
        height="30.55"
        fill="transparent"
        style={{ cursor: 'pointer' }}
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); onToggle() }}
      />
    </>
  )
}

export default function App() {
  const [doorClosed, setDoorClosed] = useState(false)
  const location = useLocation()

  // Quando si arriva alla home con un hash di sezione (es. da una CTA "/#prenota"
  // di un'altra pagina), scorri fino alla sezione una volta montato il layout.
  useEffect(() => {
    if (!location.hash) return
    const id = setTimeout(() => scrollToSection(location.hash), 80)
    return () => clearTimeout(id)
  }, [location.hash])

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
            className="text-sm md:text-base font-semibold tracking-[0.15em] md:tracking-[0.3em] uppercase mb-4"
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
            className="mb-5 text-center flex flex-col md:flex-row items-center justify-center gap-2 md:gap-7" style={{ lineHeight: '1.02', fontSize: 'clamp(2rem, 9vw, 6rem)' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 87.27 72.58"
              role="img"
              aria-label="Logo Psicoterapia Psicodinamica Sociale"
              className="logo-rainbow"
              style={{ height: '2.1em', width: 'auto', flexShrink: 0 }}
            >
              <defs>
                <style>{`
                  .lp-cls-1 { fill: #0900aa; }
                  .lp-cls-2 { fill: #d92a2c; }
                  .lp-cls-2, .lp-cls-3 { stroke: #ff66d2; stroke-miterlimit: 10; stroke-width: .25px; }
                  .lp-cls-3, .lp-cls-4 { fill: #bf4c9e; }
                  .lp-cls-5 { fill: #ff66d2; }
                  .lp-cls-bg { fill: #ffffff; }
                `}</style>
              </defs>
              <rect className="lp-cls-bg" x="30.85" y="30.06" width="24.07" height="30.55" />
              <g className="logo-star-wrap">
                <rect x="-1" y="28" width="14" height="14" fill="transparent" />
                <polygon className="lp-cls-2 logo-star" points="5.93 30.06 4.32 33.52 .34 33.77 3.37 36.13 2.42 39.68 5.93 37.74 9.43 39.68 8.48 36.13 11.61 33.77 7.54 33.52 5.93 30.06" />
              </g>
              <g>
                <polyline className="lp-cls-4" points="18.01 31.81 43.61 16.11 69.01 31.81 70.71 28.51 61.31 22.71 43.61 11.91 16.21 28.51" />
                <polygon className="lp-cls-5" points="69.06 31.98 68.95 31.91 43.61 16.25 18.08 31.91 17.95 31.7 43.61 15.96 43.68 16 68.96 31.63 70.55 28.55 61.25 22.81 43.61 12.05 16.28 28.61 16.15 28.4 43.61 11.76 43.68 11.8 61.38 22.6 70.88 28.46 69.06 31.98" />
              </g>
              <polygon className="lp-cls-3" points="26.28 27.37 59.79 27.37 59.79 60.61 54.92 60.61 54.92 30.06 30.85 30.06 30.85 60.61 26.28 60.61 26.28 27.37" />
              {/* Porta: si chiude in prospettiva al click */}
              <LogoDoor closed={doorClosed} onToggle={() => setDoorClosed((v) => !v)} />
              <path className="lp-cls-4" d="M43.62.73C25.76.68,8.49,10.81,3.73,24.92l-.6,1.99h3.11C9.55,17.89,20,2.36,43.62,2.31c17.13-.05,32.81,9.23,37.57,22.51l.53,1.57h2.58C81.32,14.53,67.56.73,43.62,0v.73Z" />
              <path className="lp-cls-4" d="M43.82,71.78c17.86.06,35.13-10.99,39.89-26.38l.6-2.17h-3.11c-3.31,9.84-13.76,26.78-37.38,26.84-17.13.06-32.81-10.07-37.57-24.55l-.53-1.72h-2.58c2.98,12.93,16.74,27.99,40.68,28.79v-.8Z" />
              <g className="logo-star-wrap">
                <rect x="74" y="28" width="14" height="14" fill="transparent" />
                <polygon className="lp-cls-2 logo-star" points="81.46 29.86 79.92 33.28 76.09 33.53 79 35.86 78.09 39.36 81.46 37.45 84.83 39.36 83.92 35.86 86.93 33.53 83.01 33.28 81.46 29.86" />
              </g>
            </svg>
            <span className="hero-name">Psicoterapia<br />Psicodinamica<br />Sociale</span>
          </motion.h1>
          <motion.p
            variants={itemSpring}
            className="text-lg leading-relaxed mb-6 text-center max-w-md"
            style={{ color: 'rgba(255,255,255,0.82)' }}
          >
            Un percorso di psicoterapia psicodinamica accessibile a tutti.
            Sedute <strong style={{ color: '#ffffff' }}>online</strong> a <strong style={{ color: '#fca5a5' }}>tariffe accessibili</strong>.
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
        <ScrollReveal className="flex flex-col sm:flex-row items-center gap-6 md:gap-12 max-w-5xl w-full">
          <motion.div variants={itemSpring} className="hidden sm:block w-full sm:w-1/2 shrink-0">
            <CardImage
              src={photoCose}
              fallback={imgCose}
              alt="Psicoterapia psicodinamica"
              tint="#2563eb"
              photoBg="#9C95D4"
              variant="green"
            />
          </motion.div>
          <div className="flex flex-col w-full sm:w-1/2 text-left">
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
                Inizia il percorso
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
        <ScrollReveal className="flex flex-col sm:flex-row items-center gap-6 md:gap-12 max-w-5xl w-full">
          <motion.div variants={itemSpring} className="hidden sm:block w-full sm:w-1/2 shrink-0">
            <CardImage
              src={photoComeFunziona}
              fallback={imgComeFunziona}
              alt="Come funziona il percorso"
              tint="#4f6ae8"
              photoBg="#4A80C7"
              variant="orange"
            />
          </motion.div>
          <div className="flex flex-col w-full sm:w-1/2 text-left">
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
              Si parte da un primo colloquio libero: nessuna domanda giusta o sbagliata, nessuna pressione. Si racconta la propria storia e insieme si valuta il percorso più adeguato. La frequenza delle sedute viene concordata.{' '}
              <Link to="/come-funziona" style={{ color: '#4f6ae8', fontWeight: 600, textDecoration: 'underline' }}>continua a leggere →</Link>
            </motion.p>
            <motion.div variants={itemSpring} className="flex flex-col gap-3" style={{ width: '100%' }}>
              <div style={{ padding: '14px 20px', borderRadius: '20px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(79,106,232,0.22)' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b7280', margin: '0 0 2px' }}>Psicoterapia individuale</p>
                <p style={{ fontSize: '22px', fontWeight: 600, color: '#4f6ae8', fontFamily: "'Cormorant Garamond', serif", margin: 0 }}>40€ a seduta · 50 minuti</p>
              </div>
              <div style={{ padding: '14px 20px', borderRadius: '20px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(79,106,232,0.22)' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b7280', margin: '0 0 2px' }}>Psicoterapia di coppia</p>
                <p style={{ fontSize: '22px', fontWeight: 600, color: '#4f6ae8', fontFamily: "'Cormorant Garamond', serif", margin: 0 }}>50€ a seduta · 50 minuti</p>
              </div>
              <div style={{ padding: '14px 20px', borderRadius: '20px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(79,106,232,0.22)' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b7280', margin: '0 0 2px' }}>Psicoterapia familiare</p>
                <p style={{ fontSize: '22px', fontWeight: 600, color: '#4f6ae8', fontFamily: "'Cormorant Garamond', serif", margin: 0 }}>50€ a seduta · 50 minuti</p>
              </div>
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
        <ScrollReveal className="flex flex-col sm:flex-row items-center gap-6 md:gap-12 max-w-5xl w-full">
          <motion.div variants={itemSpring} className="hidden sm:block w-full sm:w-1/2 shrink-0">
            <CardImage
              src={photoTeam}
              fallback={imgTeam}
              alt="Il nostro team"
              tint="#7b6ef2"
              photoBg="#0081CC"
              variant="indigo"
            />
          </motion.div>
          <div className="flex flex-col w-full sm:w-1/2 text-left">
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
              Siamo psicoterapeuti di formazione psicodinamica con più di dieci anni di esperienza clinica e un lungo percorso di analisi personale. Lavoriamo online, con cura e con metodo. Crediamo che la qualità di un percorso terapeutico non debba essere un privilegio. La cura dovrebbe essere alla portata di chi ne ha bisogno.
            </motion.p>
            <motion.p variants={itemSpring} className="text-sm leading-relaxed mb-8" style={{ color: '#4b5563' }}>
              Il team vanta una consolidata esperienza clinica nei disturbi del comportamento alimentare, nelle dipendenze, nei disturbi dell&apos;umore, nei disturbi d&apos;ansia e ossessivi, nella presa in carico di quadri clinici complessi, inclusi i disturbi di personalità e le forme di psicopatologia grave.
            </motion.p>
            <motion.p variants={itemSpring} className="text-sm leading-relaxed mb-8" style={{ color: '#4b5563' }}>
              Riserviamo posti a tariffa sociale per chi si trova in difficoltà economica. Le disponibilità sono limitate. Per verificare le disponibilità e prenotare il primo colloquio contatta direttamente il professionista scelto.
            </motion.p>
            <motion.div variants={itemSpring} className="w-full mb-4 md:mb-8">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#5b4de0' }}>Aree di expertise</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {["Disturbi alimentari", "Dipendenze", "Disturbi dell'umore", "Ansia e OCD", "Disturbi di personalità", "Traumi complessi", "Relazioni difficili", "Disabilità", "LGBTQ+"].map(area => (
                  <span key={area} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em', lineHeight: 1.25, padding: '10px 12px', borderRadius: '16px', background: 'rgba(91,77,224,0.10)', border: '1px solid rgba(91,77,224,0.28)', color: '#3730a3' }}>{area}</span>
                ))}
              </div>
            </motion.div>
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
          borderRadius: '32px',
          margin: '0 10px',
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
            Scegli il professionista e contattalo direttamente per prenotare il primo colloquio.
          </motion.p>
          <motion.p variants={itemSpring} className="text-sm leading-relaxed mb-10 text-center max-w-lg" style={{ color: '#8b87a8' }}>
            Ogni terapeuta gestisce autonomamente il proprio calendario, le proprie tariffe e le disponibilità a tariffa sociale. Per verificare le disponibilità e prenotare, contatta direttamente il professionista scelto tramite il suo calendario o la sua email.
          </motion.p>
          <motion.div variants={itemSpring} style={{ width: '100%' }}>
            <TherapistContacts />
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
          borderRadius: '32px 32px 0 0',
          margin: '0 10px 0',
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
            Ciò che cerchiamo non si esaurisce nella competenza tecnica. Crediamo che fare bene questo lavoro significhi prima di tutto averlo esperito su se stessi — che la psicoterapia non sia soltanto un mestiere, ma un modo di stare nel mondo e in relazione. L&apos;analisi personale, in questo senso, non è un requisito formale: è la condizione che rende possibile tutto il resto. Questo non è un progetto commerciale. Ai professionisti che sceglieranno di aderire non verrà trattenuta alcuna percentuale sul compenso delle sedute. L&apos;obiettivo è unicamente quello di rendere accessibile una psicoterapia di orientamento psicodinamico a chi la cerca, e di costruire una comunità professionale che condivida questa visione. Se ti riconosci in questo spirito, saremo felici di ricevere la tua candidatura. Le disponibilità sono limitate. Qualora non vi fossero posti aperti al momento della candidatura, il nominativo verrà inserito in una lista e il professionista verrà contattato non appena si renderà disponibile uno spazio.
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
      <footer style={{ background: '#f5f5f5', padding: '44px 24px 40px', textAlign: 'center', position: 'relative', zIndex: 7 }}>
        <p style={{ margin: 0, fontSize: '12px', letterSpacing: '0.08em', color: '#9ca3af' }}>
          © 2026 Psicodinamica Sociale · <a href="#/privacy" style={{ color: '#9ca3af' }}>Privacy Policy</a>
        </p>
        <p style={{ margin: '8px 0 0', fontSize: '12px', letterSpacing: '0.08em', color: '#b8b8b8' }}>
          Sito web realizzato da{' '}
          <a href="https://epixiom.io" target="_blank" rel="noopener noreferrer" style={{ color: '#7b6ef2', textDecoration: 'none', fontWeight: 600 }}>
            Epixiom
          </a>
        </p>
      </footer>
    </div>
  )
}

