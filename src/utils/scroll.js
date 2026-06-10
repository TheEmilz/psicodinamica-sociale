// ─── Smooth scroll utility ───────────────────────────────────────────────────
// offsetTop is unreliable for position:sticky elements (reports stuck position).
// We calculate the natural document top by summing the offsetHeight of all
// non-fixed preceding siblings instead.

export function smoothScrollTo(targetY, duration = 900) {
  const startY = window.scrollY
  const diff = targetY - startY
  let startTime = null

  function ease(t) {
    // easeInOutQuart — starts slow, accelerates, ends slow
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
  }

  function step(ts) {
    if (!startTime) startTime = ts
    const elapsed = ts - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, startY + diff * ease(progress))
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

export function scrollToSection(href) {
  const id = href.startsWith('#') ? href.slice(1) : href
  const el = document.getElementById(id)
  if (!el) return

  // Le sezioni sono position:sticky. Per questi elementi sia
  // getBoundingClientRect().top sia offsetTop riportano la posizione "incollata"
  // corrente (che cambia con lo scroll), non quella naturale nel flusso. Di
  // conseguenza lo scroll finiva nel punto sbagliato (in particolare la hero,
  // sticky a top:0, riportava sempre la posizione corrente).
  //
  // offsetHeight invece è stabile: calcoliamo la posizione naturale dell'elemento
  // sommando l'altezza dei fratelli precedenti che occupano spazio nel flusso
  // (saltando header/elementi fixed o absolute), poi risaliamo eventuali wrapper.
  let targetY = 0
  let node = el
  while (node && node.parentElement) {
    let sib = node.previousElementSibling
    while (sib) {
      const pos = getComputedStyle(sib).position
      if (pos !== 'fixed' && pos !== 'absolute') {
        targetY += sib.offsetHeight
      }
      sib = sib.previousElementSibling
    }
    node = node.parentElement
    // Fermati alla radice del documento
    if (node === document.body || node === document.documentElement) break
  }

  smoothScrollTo(targetY)
}
