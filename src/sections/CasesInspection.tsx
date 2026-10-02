import { useRef, useState } from 'react'
import { cases } from '../data/content'
import styles from '../styles/site.module.css'
import { Container, Media, SectionHeader } from '../components/ui'

export function Cases() {
  const [activeCase, setActiveCase] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const item = cases[activeCase]
  const selectCase = (index: number) => {
    setActiveCase(index)
    tabRefs.current[index]?.focus()
  }
  const onTabKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? cases.length - 1 : event.key === 'ArrowRight' ? (index + 1) % cases.length : (index - 1 + cases.length) % cases.length
    selectCase(next)
  }
  return <section id="cases" className={`${styles.section} ${styles.casesSection}`}><Container>
    <SectionHeader dark kicker="Как показываем работы" title="Не просто фото после — задача, решение и результат" text="Ниже — демонстрационные сценарии для портфолио. Они показывают формат будущих кейсов и не являются реальными работами MOTIVE." />
    <div className={styles.caseTabs} role="tablist" aria-label="Демонстрационные кейсы">{cases.map((caseItem, index) => <button key={caseItem.id} ref={node => { tabRefs.current[index] = node }} role="tab" id={`case-tab-${caseItem.id}`} aria-controls={`case-panel-${caseItem.id}`} aria-selected={activeCase === index} tabIndex={activeCase === index ? 0 : -1} onClick={() => selectCase(index)} onKeyDown={event => onTabKeyDown(index, event)}><span>{caseItem.id}</span>{caseItem.title}</button>)}</div>
    <div className={styles.caseList}><article className={styles.case} id={`case-panel-${item.id}`} role="tabpanel" aria-labelledby={`case-tab-${item.id}`}>
      <div className={styles.caseMedia}><Media src={item.images.main} label={`${item.title}: основной демонстрационный кадр`} /><div className={styles.supportMedia}><Media src={item.images.before} label={`${item.title}: исходное состояние или подготовка`}/><Media src={item.images.process} label={`${item.title}: процесс работы`}/></div></div>
      <div className={styles.caseCopy}><span className={styles.caseLabel}>ДЕМО-КЕЙС {item.id}</span><h3>{item.title}</h3><dl><dt>Задача</dt><dd>{item.task}</dd><dt>Возможное решение</dt><dd>{item.solution}</dd></dl>
        <div className={styles.caseColumns}><div><strong>Что показать</strong><ul>{item.show.map(x => <li key={x}>{x}</li>)}</ul></div><div><strong>Поля реального проекта</strong><ul>{item.fields.map(x => <li key={x}>{x}</li>)}</ul></div></div>
        <a className={styles.textButton} href="#estimate">{item.cta}</a>
      </div>
    </article></div>
    <div className={styles.caseClosing}><p>В рабочем сайте раздел заменяется реальными фотографиями и подтверждёнными данными студии.</p></div>
  </Container></section>
}

export function Inspection() {
  return <section className={styles.inspection}><Container className={styles.inspectionGrid}><div><h2>Не всё стоит оценивать дистанционно</h2><p>Предварительный расчёт помогает определить подходящий вариант и порядок стоимости. Но состояние автомобиля иногда нужно увидеть лично.</p></div><div><ul><li>на кузове есть заметные повреждения;</li><li>состояние салона сложно оценить по описанию;</li><li>планируется несколько видов работ;</li><li>результат зависит от состояния поверхности.</li></ul><p><strong>Фото могут помочь на первом этапе, но не всегда заменяют осмотр.</strong></p><a className={styles.primaryButton} href="#estimate">Получить предварительный расчёт</a></div></Container></section>
}
