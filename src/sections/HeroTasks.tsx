import { media, scenarios } from '../data/content'
import styles from '../styles/site.module.css'
import { Container, Media, SectionHeader } from '../components/ui'

export function Hero() {
  return <section id="top" className={styles.hero} aria-labelledby="hero-title"><Container className={styles.heroGrid}>
    <div className={styles.heroCopy}>
      <p className={styles.directions}>PPF · Полировка · Защитные покрытия · Интерьер · Тонировка</p>
      <h1 id="hero-title">Защита, восстановление и уход — под состояние автомобиля</h1>
      <p className={styles.lead}>PPF, полировка, защитные покрытия, интерьер и тонировка. Выберите задачу — концепт покажет подходящие направления.</p>
      <div className={styles.heroActions}><a className={styles.primaryButton} href="#solutions">Выбрать решение</a><a className={styles.secondaryButton} href="#estimate">Открыть демо-форму</a></div>
      <div className={styles.heroSignals} role="note"><span>Портфолио-концепт · вымышленный бренд · изображения и кейсы демонстрационные</span></div>
    </div>
    <Media src={media.hero} label="Автомобиль в светлой детейлинг-студии" className={styles.heroMedia} eager />
  </Container></section>
}

export function Tasks() {
  return <section id="solutions" className={styles.section}><Container>
    <SectionHeader kicker="Задачи и услуги" title="Выберите, что нужно автомобилю" text="Карточки связывают задачу с подходящими направлениями — без необходимости знать термины." />
    <div className={styles.scenarioGrid}>{scenarios.map((item) => <article className={styles.scenario} key={item.title}>
      <Media src={item.media} label={item.alt} className={styles.scenarioMedia} />
      <div className={styles.scenarioBody}><h3>{item.title}</h3><p>{item.text}</p><ul>{item.options.map(option => <li key={option}>{option}</li>)}</ul><a className={styles.textButton} href={item.href}>{item.cta}</a></div>
    </article>)}</div>
  </Container></section>
}
