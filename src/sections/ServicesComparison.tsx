import { useRef, useState } from 'react'
import { services } from '../data/content'
import styles from '../styles/site.module.css'
import { Container, SectionHeader } from '../components/ui'

export function Services() {
  const [expanded, setExpanded] = useState<number | null>(null)
  return <section id="services" className={styles.section}><Container>
    <SectionHeader kicker="Направления" title="Что можно сделать с автомобилем" text="Коротко о том, какую задачу решает каждое направление и от чего зависит выбор." />
    <div className={styles.serviceList}>{services.map((service, index) => {
      const isOpen = expanded === index
      return <article className={styles.serviceRow} key={service.title}>
        <div className={styles.serviceTitle}><span>{String(index + 1).padStart(2, '0')}</span><h3>{service.title}</h3></div>
        <p className={styles.serviceShort}>{service.short}</p>
        <button className={styles.accordionButton} aria-expanded={isOpen} aria-controls={`service-${index}`} onClick={() => setExpanded(isOpen ? null : index)}>{isOpen ? 'Скрыть' : 'Подробнее'}<span aria-hidden="true">{isOpen ? '−' : '+'}</span></button>
        <div id={`service-${index}`} className={`${styles.serviceDetails} ${isOpen ? styles.serviceDetailsOpen : ''}`}>
          {service.when && <div><strong>Когда рассматривают</strong><p>{service.when}</p></div>}
          <div><strong>{service.important ? 'Важно' : 'От чего зависит'}</strong><p>{service.depends}</p></div>
          <a className={styles.textButton} href={service.title === 'Защитные покрытия' ? '#comparison' : '#estimate'}>{service.cta}</a>
        </div>
      </article>
    })}</div>
    <a className={styles.primaryButton} href="#estimate">Не уверены, что подходит? Получить предварительный расчёт</a>
  </Container></section>
}

type TabId = 'protection' | 'polish'
const tabs: { id: TabId; label: string }[] = [{ id: 'protection', label: 'PPF / защитное покрытие' }, { id: 'polish', label: 'Полировка / защитное покрытие' }]

export function Comparison() {
  const [active, setActive] = useState<TabId>('protection')
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    let next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : event.key === 'ArrowRight' ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length
    setActive(tabs[next].id); refs.current[next]?.focus()
  }
  return <section id="comparison" className={`${styles.section} ${styles.comparison}`}><Container>
    <SectionHeader dark kicker="Как выбрать" title="Плёнка, покрытие или полировка — в чём разница?" text="У этих работ разные задачи. Сравним без лишней терминологии." />
    <div className={styles.tabs} role="tablist" aria-label="Сравнение услуг">{tabs.map((tab, index) => <button key={tab.id} ref={node => { refs.current[index] = node }} role="tab" aria-selected={active === tab.id} aria-controls={`panel-${tab.id}`} id={`tab-${tab.id}`} tabIndex={active === tab.id ? 0 : -1} onClick={() => setActive(tab.id)} onKeyDown={event => onKeyDown(index, event)}>{tab.label}</button>)}</div>
    {active === 'protection' ? <div className={styles.tabPanel} role="tabpanel" id="panel-protection" aria-labelledby="tab-protection">
      <ComparisonColumns first="PPF" second="Защитное покрытие" rows={[
        ['Главная задача', 'Физически закрыть поверхность плёнкой.', 'Изменить свойства обработанной поверхности и упростить уход.'],
        ['Когда чаще рассматривают', 'Когда нужна защита отдельных зон или большей части кузова от внешнего воздействия.', 'Когда важны внешний вид, уход и защита в пределах возможностей состава.'],
        ['Что влияет на стоимость', 'Количество деталей, сложность оклейки, материал и подготовка.', 'Состояние поверхности, подготовка и выбранное покрытие.'],
      ]}/><p className={styles.conclusion}>Это не взаимозаменяемые услуги. Выбор зависит от того, от чего именно вы хотите защитить автомобиль.</p><a className={styles.darkButton} href="#estimate">Помочь выбрать</a>
    </div> : <div className={styles.tabPanel} role="tabpanel" id="panel-polish" aria-labelledby="tab-polish">
      <ComparisonColumns first="Полировка" second="Защитное покрытие" rows={[["Разница подходов", 'Работает с текущим состоянием поверхности и помогает уменьшить видимость части дефектов.', 'Наносится на подготовленную поверхность, но само по себе не исправляет существующие дефекты кузова.']]}/><p className={styles.conclusion}>Если поверхность уже требует коррекции, одного покрытия может быть недостаточно.</p><a className={styles.darkButton} href="#estimate">Обсудить состояние автомобиля</a>
    </div>}
  </Container></section>
}

function ComparisonColumns({ first, second, rows }: { first: string; second: string; rows: string[][] }) {
  return <div className={styles.comparisonTable}><div className={styles.comparisonHeads}><strong>{first}</strong><strong>{second}</strong></div>{rows.map(row => <div className={styles.comparisonRow} key={row[0]}><span>{row[0]}</span><p data-label={first}>{row[1]}</p><p data-label={second}>{row[2]}</p></div>)}</div>
}
