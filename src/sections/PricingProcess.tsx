import { pricing, processSteps } from '../data/content'
import styles from '../styles/site.module.css'
import { Container, SectionHeader } from '../components/ui'

export function Pricing() {
  return <section id="pricing" className={`${styles.section} ${styles.pricingSection}`}><Container className={styles.splitLayout}>
    <div><SectionHeader kicker="Ориентир по бюджету" title="Цена зависит от автомобиля и объёма работ" text="До осмотра можно определить порядок стоимости. Финальная сумма зависит от состояния автомобиля, площади работ, подготовки и выбранных материалов." />
      <div className={styles.demoNote}><strong>Почему на демо нет выдуманных цен</strong><p>Для реального сайта здесь будут указаны подтверждённые студией цены: «от», диапазоны или фиксированные пакеты там, где это возможно.</p></div>
    </div>
    <div className={styles.pricingList}>{pricing.map(([title, label, text]) => <article key={title}><h3>{title}</h3><strong>{label}</strong><p>{text}</p></article>)}
      <a className={styles.primaryButton} href="#estimate">Открыть демо-форму</a>
    </div>
  </Container></section>
}

export function Process() {
  return <section id="process" className={`${styles.section} ${styles.processSection}`}><Container className={styles.splitLayout}>
    <div><SectionHeader kicker="Как проходит работа" title="Четыре понятных этапа" text="Сценарий остаётся прозрачным: от запроса и осмотра до согласования результата." /></div>
    <ol className={styles.timeline}>{processSteps.map(([title, text], index) => <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
  </Container></section>
}
