import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { navigation } from '../data/content'
import styles from '../styles/site.module.css'
import { Container } from './ui'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const close = () => { setOpen(false); window.setTimeout(() => menuButton.current?.focus(), 0) }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const shell = document.querySelector<HTMLElement>('[data-page-shell]')
    document.body.classList.add('menu-open')
    shell?.setAttribute('inert', '')
    const focusables = panel.current?.querySelectorAll<HTMLElement>('a,button:not([disabled])')
    focusables?.[0]?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'Tab' && focusables?.length) {
        const first = focusables[0], last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('menu-open')
      shell?.removeAttribute('inert')
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
    <Container className={styles.headerInner}>
      <a className={styles.logo} href="#top" aria-label="MOTIVE Detail Studio — наверх"><strong>MOTIVE</strong><span>DETAIL STUDIO</span></a>
      <nav className={styles.desktopNav} aria-label="Основная навигация">
        {navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        <a className={styles.primaryButton} href="#estimate">Получить расчёт</a>
      </nav>
      <button ref={menuButton} className={styles.menuButton} aria-expanded={open} aria-controls="mobile-menu" aria-label="Открыть меню" onClick={() => setOpen(true)}><span/><span/><span/></button>
    </Container>
    {open && createPortal(<div id="mobile-menu" ref={panel} className={styles.mobileMenu} role="dialog" aria-modal="true" aria-label="Меню сайта">
      <Container className={styles.mobileMenuInner}>
        <button className={styles.closeButton} onClick={close} aria-label="Закрыть меню">×</button>
        <nav>{navigation.map(([label, href]) => <a key={href} href={href} onClick={close}>{label}</a>)}</nav>
        <a className={styles.primaryButton} href="#estimate" onClick={close}>Открыть демо-форму</a>
      </Container>
    </div>, document.body)}
  </header>
}
