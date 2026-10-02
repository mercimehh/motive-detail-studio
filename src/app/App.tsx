import { useEffect, useRef, useState } from 'react'
import { Header } from '../components/Header'
import { Hero, Tasks } from '../sections/HeroTasks'
import { Comparison } from '../sections/ServicesComparison'
import { Pricing, Process } from '../sections/PricingProcess'
import { Cases } from '../sections/CasesInspection'
import { EstimateSection } from '../sections/EstimateForm'
import { Contacts, Footer } from '../sections/ContactsFooter'
import styles from '../styles/site.module.css'

export function App() {
  const [sticky, setSticky] = useState(false)
  const [privacy, setPrivacy] = useState(false)
  const dialog = useRef<HTMLDivElement>(null)
  const privacyOpener = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const hero = document.querySelector('#top'); const form = document.querySelector('#estimate')
    if (!hero || !form) return
    let heroVisible = true, formVisible = false
    const update = () => setSticky(!heroVisible && !formVisible)
    const heroObserver = new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; update() }, { threshold: .05 })
    const formObserver = new IntersectionObserver(([entry]) => { formVisible = entry.isIntersecting; update() }, { threshold: .03 })
    heroObserver.observe(hero); formObserver.observe(form)
    return () => { heroObserver.disconnect(); formObserver.disconnect() }
  }, [])
  useEffect(() => {
    if (!privacy) return
    const shell = document.querySelector<HTMLElement>('[data-page-shell]')
    const focusables = dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input,textarea,[tabindex]:not([tabindex="-1"])')
    document.body.classList.add('overlay-open')
    shell?.setAttribute('inert', '')
    focusables?.[0]?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPrivacy(false)
      if (event.key === 'Tab' && focusables?.length) {
        const first = focusables[0], last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('overlay-open')
      shell?.removeAttribute('inert')
      document.removeEventListener('keydown', onKey)
      window.setTimeout(() => privacyOpener.current?.focus(), 0)
    }
  }, [privacy])
  const openPrivacy = () => { privacyOpener.current = document.activeElement as HTMLElement | null; setPrivacy(true) }
  return <>
    <div data-page-shell><a className={styles.skipLink} href="#main">Перейти к содержанию</a><Header/><main id="main"><Hero/><Tasks/><Comparison/><Pricing/><Process/><Cases/><EstimateSection onPrivacy={openPrivacy}/><Contacts/></main><Footer onPrivacy={openPrivacy}/>{sticky && <div className={styles.mobileSticky}><a href="#estimate">Демо-форма</a><a href="#contacts">Контакты</a></div>}</div>
    {privacy && <div className={styles.modalBackdrop} role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setPrivacy(false) }}><div ref={dialog} className={styles.privacyModal} role="dialog" aria-modal="true" aria-labelledby="privacy-title" aria-describedby="privacy-description"><button className={styles.modalClose} onClick={() => setPrivacy(false)} aria-label="Закрыть политику">×</button><h2 id="privacy-title">Обработка данных в демо-форме</h2><div id="privacy-description"><p>MOTIVE Detail Studio — вымышленный бренд и портфолио-концепт. Серверная отправка не подключена.</p><p>Введённые данные и выбранные фотографии используются только локально в вашем браузере для демонстрации интерфейса и никуда не передаются.</p></div><button className={styles.secondaryButton} onClick={() => setPrivacy(false)}>Закрыть</button></div></div>}
  </>
}
