import type { ReactNode } from 'react'
import styles from '../styles/site.module.css'

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.container} ${className}`}>{children}</div>
}

export function Kicker({ children }: { children: ReactNode }) { return <p className={styles.kicker}>{children}</p> }

export function SectionHeader({ kicker, title, text, dark = false }: { kicker?: string; title: string; text?: string; dark?: boolean }) {
  return <div className={`${styles.sectionHeader} ${dark ? styles.sectionHeaderDark : ''}`}>
    {kicker && <Kicker>{kicker}</Kicker>}<h2>{title}</h2>{text && <p>{text}</p>}
  </div>
}

export function Media({ src, label, className = '', eager = false }: { src: string; label: string; className?: string; eager?: boolean }) {
  return <figure className={`${styles.media} ${className}`}>
    <img src={src} alt={label} width="1200" height="900" loading={eager ? 'eager' : 'lazy'} />
  </figure>
}
