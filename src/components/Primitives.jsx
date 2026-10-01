import React from 'react';
import { motion } from 'motion/react';

const rise = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: .8, ease: [.22, 1, .36, 1] } } };

export function Stars() {
  return <div className="stars" aria-hidden="true">{Array.from({ length: 44 }, (_, i) => <i key={i} style={{ '--x': `${(i * 67 + 11) % 100}%`, '--y': `${(i * 43 + 7) % 100}%`, '--d': `${2 + (i % 5)}s`, '--delay': `${(i % 8) * -.7}s`, '--size': `${1 + (i % 3)}px` }} />)}</div>;
}

export function Reveal({ children, className = '' }) {
  return <motion.div className={className} variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, amount: .18 }}>{children}</motion.div>;
}

export function SectionTitle({ eyebrow, children }) {
  return <Reveal className="section-title"><span className="eyebrow">{eyebrow}</span><h2>{children}</h2><span className="title-rule" /></Reveal>;
}
