import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/**
 * ScrollReveal
 *
 * Wraps section content in a motion.div that:
 *  - uses useInView (once: true, amount: 0.25) to fire only once
 *  - animates scale 0.95 → 1  +  opacity 0 → 1  (spring, stiffness 70)
 *  - staggers direct motion children by 120 ms via variant propagation
 *
 * Children that declare `variants={itemSpring}` or `variants={wordSpring}`
 * (imported from ./springVariants) will animate when the container enters
 * the viewport.
 */
export function ScrollReveal({ children, className, style }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.25 })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 70,
            damping: 18,
            staggerChildren: 0.12,
            delayChildren: 0.08,
          },
        },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
