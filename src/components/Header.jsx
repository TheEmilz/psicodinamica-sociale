import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { scrollToSection } from '../utils/scroll'

const NAV_LINKS = [
  { label: 'HOME', href: '#home' },
  { label: "COS'È", href: '#cos-e' },
  { label: 'COME FUNZIONA', href: '#come-funziona' },
  { label: 'IL TEAM', href: '#il-team' },
  { label: 'PRENOTA', href: '#prenota' },
]

function handleNavClick(e, href) {
  e.preventDefault()
  scrollToSection(href)
}

// ─── Nav-wrapper animated style ──────────────────────────────────────────────
// The outer <header> is always fixed; only this inner wrapper changes shape/color.
function getNavAnimate(scrolled, sectionTheme) {
  if (!scrolled) {
    return {
      backgroundColor: 'rgba(245,245,245,0)',
      borderColor: 'rgba(0,0,0,0)',
      boxShadow: '0 0px 0px rgba(0,0,0,0)',
      paddingTop: '20px',
      paddingBottom: '20px',
      borderRadius: '0px',
    }
  }
  if (sectionTheme === 'orange') {
    return {
      backgroundColor: 'rgba(255,248,245,0.92)',
      borderColor: 'rgba(251,146,60,0.18)',
      boxShadow: '0 4px 24px rgba(251,146,60,0.10)',
      paddingTop: '12px',
      paddingBottom: '12px',
      borderRadius: '16px',
    }
  }
  if (sectionTheme === 'blue') {
    return {
      backgroundColor: 'rgba(245,248,255,0.92)',
      borderColor: 'rgba(37,99,235,0.14)',
      boxShadow: '0 4px 24px rgba(37,99,235,0.07)',
      paddingTop: '12px',
      paddingBottom: '12px',
      borderRadius: '16px',
    }
  }
  if (sectionTheme === 'green') {
    return {
      backgroundColor: 'rgba(240,253,244,0.92)',
      borderColor: 'rgba(16,185,129,0.18)',
      boxShadow: '0 4px 24px rgba(16,185,129,0.10)',
      paddingTop: '12px',
      paddingBottom: '12px',
      borderRadius: '16px',
    }
  }
  if (sectionTheme === 'indigo') {
    return {
      backgroundColor: 'rgba(245,244,255,0.92)',
      borderColor: 'rgba(99,102,241,0.16)',
      boxShadow: '0 4px 24px rgba(99,102,241,0.08)',
      paddingTop: '12px',
      paddingBottom: '12px',
      borderRadius: '16px',
    }
  }
  return {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderColor: 'rgba(0,0,0,0.07)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    paddingTop: '12px',
    paddingBottom: '12px',
    borderRadius: '16px',
  }
}

// ─── Link / button color scheme ───────────────────────────────────────────────
function getColors(scrolled, sectionTheme) {
  if (!scrolled) {
    return {
      logo: '#ffffff',
      logoSub: 'rgba(255,255,255,0.65)',
      link: '#ffffff',
      linkHover: '#ef4444',
      underline: '#ef4444',
      burger: '#ffffff',
      ctaBg: 'transparent',
      ctaText: '#ffffff',
      ctaBorder: 'rgba(255,255,255,0.45)',
      ctaBgHover: '#ef4444',
      ctaTextHover: '#ffffff',
    }
  }
  return {
    logo: '#dc2626',
    logoSub: '#9ca3af',
    link: '#1f2937',
    linkHover: '#ef4444',
    underline: '#ef4444',
    burger: '#1f2937',
    ctaBg: '#dc2626',
    ctaText: '#ffffff',
    ctaBorder: '#dc2626',
    ctaBgHover: '#b91c1c',
    ctaTextHover: '#ffffff',
  }
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [sectionTheme, setSectionTheme] = useState('light')
  const [menuOpen, setMenuOpen] = useState(false)

  // ── Scroll state (triggers compact mode at 50 px) ──
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── IntersectionObserver: detect which themed section is behind the header ──
  useEffect(() => {
    const HEADER_BOTTOM = 80 // approximate px from viewport top

    // Reads DOM; called by observer and scroll listener for accuracy
    const readCurrentSection = () => {
      const sections = document.querySelectorAll('[data-header-theme]')
      for (const section of sections) {
        const { top, bottom } = section.getBoundingClientRect()
        if (top <= HEADER_BOTTOM && bottom >= 0) {
          setSectionTheme(section.dataset.headerTheme ?? 'light')
          return
        }
      }
      setSectionTheme('light')
    }

    // IntersectionObserver fires whenever any section enters/leaves the viewport,
    // at which point we re-evaluate which one is under the header.
    const observer = new IntersectionObserver(
      () => readCurrentSection(),
      { rootMargin: '0px', threshold: [0, 0.1, 0.5, 1] }
    )

    const sections = document.querySelectorAll('[data-header-theme]')
    sections.forEach(s => observer.observe(s))

    // Also listen to scroll for sub-pixel accuracy between IO callbacks,
    // throttled with rAF so each scroll event doesn't force a synchronous
    // reflow (which caused scroll jank/freezing on mobile).
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        readCurrentSection()
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    readCurrentSection() // initial read

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // When the mobile/tablet drawer is open we treat the header as "active"
  // so it gets a solid background and dark text even over the dark hero.
  const active = scrolled || menuOpen
  const navAnimate = getNavAnimate(active, sectionTheme)
  const colors = getColors(active, sectionTheme)
  const transition = { duration: 0.55, ease: [0.4, 0, 0.2, 1] }

  return (
    /* Outer header: fixed, never changes — just a positioning shell */
    <header
      className="fixed left-0 right-0 z-50 flex justify-center"
      style={{ top: '8px' }}
    >
      {/*
        Inner nav-wrapper: THIS is what changes color, shape and blur.
        - Framer Motion handles bg, border, shadow, padding, radius.
        - backdropFilter is a CSS-transition fallback (FM support varies by browser).
      */}
      <motion.nav
        id="nav-wrapper"
        className="w-full max-w-6xl mx-4"
        initial={{
          backgroundColor: 'rgba(245,245,245,0)',
          borderColor: 'rgba(0,0,0,0)',
          boxShadow: '0 0px 0px rgba(0,0,0,0)',
          paddingTop: '20px',
          paddingBottom: '20px',
          borderRadius: '0px',
        }}
        animate={navAnimate}
        transition={transition}
        style={{
          borderWidth: '1px',
          borderStyle: 'solid',
          position: 'relative',
        }}
      >
        {/* ── Blur overlay: isolated so backdrop-filter never breaks -webkit-background-clip: text on children ── */}
        <motion.div
          aria-hidden="true"
          animate={{ opacity: active ? 1 : 0 }}
          transition={transition}
          style={{
            position: 'absolute', inset: 0,
            borderRadius: 'inherit',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        {/* ── Inner row ── */}
        <div className="relative flex items-center justify-between px-6" style={{ zIndex: 1 }}>

          {/* Logo */}
          <a
            href="#home"
            className="flex flex-col leading-none select-none"
            aria-label="Psicodinamica Sociale – home"
            onClick={(e) => handleNavClick(e, '#home')}
          >
            <motion.span
              className="text-xl font-semibold tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              animate={{ color: colors.logo }}
              transition={transition}
            >
              Psicodinamica Sociale
            </motion.span>
            <motion.span
              className="text-[10px] font-light tracking-[0.25em] uppercase mt-0.5"
              animate={{ color: colors.logoSub }}
              transition={transition}
            >
              Psicoterapia Online
            </motion.span>
          </a>

          {/* Desktop navigation */}
          <ul className="hidden lg:flex items-center gap-8 list-none m-0 p-0">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <motion.a
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className="text-xs font-medium tracking-[0.2em] uppercase relative pb-0.5 block"
                  animate={{ color: colors.link }}
                  whileHover={{ color: colors.linkHover }}
                  transition={transition}
                  style={{
                    // underline slide-in via pseudo-element via Tailwind (CSS only)
                  }}
                >
                  {label}
                  {/* animated underline */}
                  <motion.span
                    className="absolute bottom-0 left-0 h-px"
                    style={{ backgroundColor: colors.underline }}
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.25 }}
                  />
                </motion.a>
              </li>
            ))}
          </ul>

          {/* CTA button */}
          <div className="hidden lg:block">
            <motion.a
              href="#prenota"
              onClick={(e) => handleNavClick(e, '#prenota')}
              className="text-xs font-semibold tracking-[0.15em] uppercase px-5 py-2.5 rounded-full block"
              animate={{
                backgroundColor: colors.ctaBg,
                color: colors.ctaText,
                borderColor: colors.ctaBorder,
              }}
              whileHover={{
                backgroundColor: colors.ctaBgHover,
                color: colors.ctaTextHover,
                scale: 1.04,
              }}
              transition={transition}
              style={{ borderWidth: '1px', borderStyle: 'solid' }}
            >
              Prenota
            </motion.a>
          </div>

          {/* Hamburger (mobile + tablet) */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-11 h-11 -mr-2 gap-1.5 focus:outline-none"
            onClick={() => setMenuOpen(p => !p)}
            aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
          >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0, backgroundColor: menuOpen ? '#1f2937' : colors.burger }}
              transition={{ duration: 0.3 }}
              className="block h-0.5 w-7 origin-center rounded-full"
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1, backgroundColor: colors.burger }}
              transition={{ duration: 0.3 }}
              className="block h-0.5 w-7 rounded-full"
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0, backgroundColor: menuOpen ? '#1f2937' : colors.burger }}
              transition={{ duration: 0.3 }}
              className="block h-0.5 w-7 origin-center rounded-full"
            />
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="lg:hidden overflow-hidden"
              style={{ position: 'relative', zIndex: 1 }}
            >
              <ul className="flex flex-col items-stretch gap-1 px-4 pt-3 pb-5 list-none m-0">
                {NAV_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="flex items-center justify-center text-sm font-medium tracking-[0.2em] uppercase text-gray-700 hover:text-red-500 hover:bg-gray-50 rounded-xl py-3.5 transition-colors duration-200"
                      onClick={(e) => { handleNavClick(e, href); setMenuOpen(false) }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
                <li className="mt-2 px-2">
                  <a
                    href="#prenota"
                    className="flex items-center justify-center text-sm font-semibold tracking-[0.15em] uppercase py-3.5 text-white hover:opacity-90 transition-opacity"
                    style={{ borderRadius: '24px', background: '#f97316' }}
                    onClick={(e) => { handleNavClick(e, '#prenota'); setMenuOpen(false) }}
                  >
                    Prenota
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  )
}

