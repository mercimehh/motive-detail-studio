import { useEffect, useMemo, useRef, useState } from 'react'
import styles from '../styles/site.module.css'
import { Kicker } from '../components/ui'

type Method = 'WhatsApp' | 'Telegram' | 'Телефон' | ''
type ErrorKey = 'car' | 'tasks' | 'method' | 'contact' | 'consent' | 'files'
type FormErrors = Partial<Record<ErrorKey | 'submit', string>>
type FormState = { car: string; tasks: string[]; comment: string; method: Method; name: string; contact: string; consent: boolean }
const initialState: FormState = { car: '', tasks: [], comment: '', method: '', name: '', contact: '', consent: false }
const taskOptions = ['Защитить кузов', 'Улучшить состояние кузова', 'Привести салон в порядок', 'Тонировка', 'Нужна помощь с выбором']
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
const errorOrder: ErrorKey[] = ['car', 'tasks', 'method', 'contact', 'consent', 'files']
const errorTargets: Record<ErrorKey, string> = { car: 'car', tasks: 'group-tasks', method: 'group-method', contact: 'contact', consent: 'consent', files: 'files' }

export function validateEstimateForm(data: FormState, files: File[]): FormErrors {
  const errors: FormErrors = {}
  if (!data.car.trim()) errors.car = 'Укажите марку и модель автомобиля.'
  if (!data.tasks.length) errors.tasks = 'Выберите хотя бы один вариант.'
  if (!data.method) errors.method = 'Выберите способ связи.'
  if (data.method === 'Telegram') {
    const telegram = data.contact.trim()
    const digits = telegram.replace(/\D/g, '')
    if (!(/^@[A-Za-z0-9_]{4,}$/.test(telegram) || (digits.length >= 7 && digits.length <= 15))) errors.contact = 'Укажите Telegram username или номер телефона.'
  } else if (data.method && !(/^\+?[\d\s()\-]{7,20}$/.test(data.contact.trim()) && data.contact.replace(/\D/g, '').length >= 7)) errors.contact = 'Проверьте номер телефона.'
  if (!data.consent) errors.consent = 'Подтвердите, что вы понимаете демонстрационный режим формы.'
  if (files.length > 5) errors.files = 'Можно добавить не больше 5 фотографий.'
  if (files.some(file => !allowedTypes.includes(file.type))) errors.files = 'Поддерживаются JPG, PNG и WEBP.'
  return errors
}

export async function submitEstimateForm(_data: FormState): Promise<{ ok: true }> {
  await new Promise(resolve => window.setTimeout(resolve, 650))
  return { ok: true }
}

export function EstimateForm({ onPrivacy }: { onPrivacy: () => void }) {
  const [data, setData] = useState(initialState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [files, setFiles] = useState<{ file: File; url: string }[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [focusTarget, setFocusTarget] = useState<string | null>(null)
  const [fileAnnouncement, setFileAnnouncement] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const successContainerRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)
  const previousOverflowAnchor = useRef<string | null>(null)
  const previousScrollBehavior = useRef<string | null>(null)
  const filesRef = useRef(files)
  const listedErrors = useMemo(() => errorOrder.filter(key => errors[key]), [errors])

  useEffect(() => { filesRef.current = files }, [files])
  useEffect(() => () => filesRef.current.forEach(item => URL.revokeObjectURL(item.url)), [])
  useEffect(() => {
    if (!focusTarget) return
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(focusTarget)
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      target?.focus({ preventScroll: true })
      setFocusTarget(null)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [focusTarget, errors])
  useEffect(() => {
    if (status !== 'success') return
    let layoutFrame = 0
    let focusFrame = 0
    let settleTimer = 0
    const renderFrame = window.requestAnimationFrame(() => {
      layoutFrame = window.requestAnimationFrame(() => {
        settleTimer = window.setTimeout(() => {
          successContainerRef.current?.scrollIntoView({ block: 'center' })
          focusFrame = window.requestAnimationFrame(() => {
            successRef.current?.focus({ preventScroll: true })
            if (previousOverflowAnchor.current !== null) {
              document.documentElement.style.overflowAnchor = previousOverflowAnchor.current
              previousOverflowAnchor.current = null
            }
            if (previousScrollBehavior.current !== null) {
              document.documentElement.style.scrollBehavior = previousScrollBehavior.current
              previousScrollBehavior.current = null
            }
          })
        }, 100)
      })
    })
    return () => {
      window.cancelAnimationFrame(renderFrame)
      window.cancelAnimationFrame(layoutFrame)
      window.cancelAnimationFrame(focusFrame)
      window.clearTimeout(settleTimer)
      if (previousOverflowAnchor.current !== null) {
        document.documentElement.style.overflowAnchor = previousOverflowAnchor.current
        previousOverflowAnchor.current = null
      }
      if (previousScrollBehavior.current !== null) {
        document.documentElement.style.scrollBehavior = previousScrollBehavior.current
        previousScrollBehavior.current = null
      }
    }
  }, [status])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined, ...(key === 'method' ? { contact: undefined } : {}) }))
  }
  const toggleTask = (task: string) => update('tasks', data.tasks.includes(task) ? data.tasks.filter(x => x !== task) : [...data.tasks, task])
  const focusError = (key: ErrorKey) => setFocusTarget(errorTargets[key])
  const addFiles = (list: FileList | null) => {
    if (!list) return
    const incoming = Array.from(list)
    if (files.length + incoming.length > 5) {
      setErrors(prev => ({ ...prev, files: 'Можно добавить не больше 5 фотографий.' }))
      setFileAnnouncement('Файлы не добавлены: можно выбрать не больше пяти фотографий.')
      return
    }
    if (incoming.some(file => !allowedTypes.includes(file.type))) {
      setErrors(prev => ({ ...prev, files: 'Поддерживаются JPG, PNG и WEBP.' }))
      setFileAnnouncement('Файлы не добавлены: поддерживаются только JPG, PNG и WEBP.')
      return
    }
    setFiles(prev => [...prev, ...incoming.map(file => ({ file, url: URL.createObjectURL(file) }))])
    setErrors(prev => ({ ...prev, files: undefined }))
    setFileAnnouncement(`Добавлено файлов: ${incoming.length}. Всего: ${files.length + incoming.length}.`)
    if (fileRef.current) fileRef.current.value = ''
  }
  const removeFile = (index: number) => setFiles(prev => {
    const removed = prev[index]
    URL.revokeObjectURL(removed.url)
    setFileAnnouncement(`Файл ${removed.file.name} удалён. Осталось: ${prev.length - 1}.`)
    return prev.filter((_, i) => i !== index)
  })
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const nextErrors = validateEstimateForm(data, files.map(item => item.file))
    setErrors(nextErrors)
    const firstError = errorOrder.find(key => nextErrors[key])
    if (firstError) {
      focusError(firstError)
      return
    }
    setStatus('loading')
    try {
      await submitEstimateForm(data)
      files.forEach(item => URL.revokeObjectURL(item.url))
      setFiles([])
      setData(initialState)
      previousOverflowAnchor.current = document.documentElement.style.overflowAnchor
      previousScrollBehavior.current = document.documentElement.style.scrollBehavior
      document.documentElement.style.overflowAnchor = 'none'
      document.documentElement.style.scrollBehavior = 'auto'
      setStatus('success')
    } catch {
      setErrors({ submit: 'Демонстрацию не удалось завершить. Проверьте данные и попробуйте ещё раз.' })
      setStatus('idle')
    }
  }

  if (status === 'success') return <div ref={successContainerRef} className={styles.success} role="status" aria-live="polite"><span aria-hidden="true">✓</span><h3 ref={successRef} tabIndex={-1}>Демонстрация формы завершена</h3><p>Проверка интерфейса прошла успешно. Данные никуда не отправлялись.</p><button className={styles.secondaryButton} type="button" onClick={() => setStatus('idle')}>Заполнить ещё раз</button></div>
  return <form className={styles.form} onSubmit={submit} noValidate>
    <p className={styles.formDisclosure}><strong>Демонстрационная форма.</strong> Данные обрабатываются только локально в браузере и никуда не отправляются.</p>
    {listedErrors.length > 0 && <div className={styles.errorSummary} role="alert" aria-labelledby="form-errors-title"><strong id="form-errors-title">Проверьте поля формы</strong><ul>{listedErrors.map(key => <li key={key}><a href={`#${errorTargets[key]}`} onClick={event => { event.preventDefault(); focusError(key) }}>{errors[key]}</a></li>)}</ul></div>}
    <Field label="Автомобиль*" helper="Марка и модель." error={errors.car} id="car"><input id="car" value={data.car} onChange={e => update('car', e.target.value)} placeholder="Например, BMW 3 Series" aria-describedby={`car-help${errors.car ? ' error-car' : ''}`} aria-invalid={!!errors.car}/></Field>
    <fieldset id="group-tasks" tabIndex={-1} aria-describedby={errors.tasks ? 'error-tasks' : undefined} aria-invalid={!!errors.tasks}><legend>Что хотите сделать?*</legend><div className={styles.choiceGrid}>{taskOptions.map(task => <label className={data.tasks.includes(task) ? styles.choiceSelected : ''} key={task}><input type="checkbox" checked={data.tasks.includes(task)} onChange={() => toggleTask(task)}/><span>{task}</span></label>)}</div>{errors.tasks && <ErrorText id="error-tasks">{errors.tasks}</ErrorText>}</fieldset>
    <Field label="Расскажите подробнее" mark="Необязательно" helper="Коротко опишите состояние автомобиля или желаемый результат." id="comment"><textarea id="comment" value={data.comment} onChange={e => update('comment', e.target.value)} placeholder="Например: автомобиль новый, хочу защитить переднюю часть кузова." aria-describedby="comment-help"/></Field>
    <fieldset aria-describedby={errors.files ? 'error-files' : 'files-help'} aria-invalid={!!errors.files}><legend>Фотографии <span>Необязательно</span></legend><input ref={fileRef} className={styles.srOnly} id="files" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e => addFiles(e.target.files)} aria-describedby={`files-help${errors.files ? ' error-files' : ''}`} aria-invalid={!!errors.files}/><label htmlFor="files" className={styles.uploadButton}>＋ Добавить фото</label><p id="files-help" className={styles.helper}>До 5 файлов · JPG, PNG или WEBP. Файлы остаются в браузере.</p><p className={styles.srOnly} aria-live="polite">{fileAnnouncement}</p>{files.length > 0 && <><p className={styles.uploadState}>{files.length === 1 ? 'Фото добавлено' : `Добавлено файлов: ${files.length}`}</p><ul className={styles.fileList}>{files.map((item, index) => <li key={`${item.file.name}-${item.file.lastModified}`}><img src={item.url} alt=""/><span>{item.file.name}</span><button type="button" onClick={() => removeFile(index)} aria-label={`Удалить ${item.file.name}`}>Удалить</button></li>)}</ul></>}{errors.files && <ErrorText id="error-files">{errors.files}</ErrorText>}</fieldset>
    <fieldset id="group-method" tabIndex={-1} aria-describedby={errors.method ? 'error-method' : undefined} aria-invalid={!!errors.method}><legend>Предпочтительный канал ответа*</legend><div className={styles.methodChoices}>{(['WhatsApp', 'Telegram', 'Телефон'] as Method[]).map(method => <label className={data.method === method ? styles.choiceSelected : ''} key={method}><input type="radio" name="method" value={method} checked={data.method === method} onChange={() => { update('method', method); update('contact', '') }}/><span>{method}</span></label>)}</div>{errors.method && <ErrorText id="error-method">{errors.method}</ErrorText>}</fieldset>
    <div className={styles.twoFields}><Field label="Ваше имя" mark="Необязательно" id="name"><input id="name" value={data.name} onChange={e => update('name', e.target.value)} placeholder="Как к вам обращаться"/></Field><Field label={data.method === 'Telegram' ? 'Telegram*' : 'Номер телефона*'} error={errors.contact} id="contact"><input id="contact" value={data.contact} onChange={e => update('contact', e.target.value)} placeholder={data.method === 'Telegram' ? '@username или номер телефона' : '+7 ___ ___-__-__'} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? 'error-contact' : undefined}/></Field></div>
    <label className={styles.consent}><input id="consent" type="checkbox" checked={data.consent} onChange={e => update('consent', e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'error-consent' : undefined}/><span>Я понимаю, что это демонстрация и данные никуда не отправляются. <button type="button" onClick={onPrivacy}>Подробнее о данных</button></span></label>{errors.consent && <ErrorText id="error-consent">{errors.consent}</ErrorText>}
    {errors.submit && <div className={styles.submitError} role="alert"><p>{errors.submit}</p></div>}
    <button className={styles.primaryButton} type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Проверяем…' : 'Проверить демо-форму'}</button>
  </form>
}

function Field({ label, mark, helper, error, id, children }: { label: string; mark?: string; helper?: string; error?: string; id: string; children: React.ReactNode }) { return <div className={styles.field}><label htmlFor={id}>{label} {mark && <span>{mark}</span>}</label>{children}{helper && <p id={`${id}-help`} className={styles.helper}>{helper}</p>}{error && <ErrorText id={`error-${id}`}>{error}</ErrorText>}</div> }
function ErrorText({ id, children }: { id: string; children: React.ReactNode }) { return <p id={id} className={styles.error}>{children}</p> }

export function EstimateSection({ onPrivacy }: { onPrivacy: () => void }) {
  return <section id="estimate" className={styles.estimate}><div className={styles.container}><div className={styles.estimateGrid}><div className={styles.estimateIntro}><Kicker>Демо-расчёт</Kicker><h2>Проверьте, как будет работать заявка</h2><p>Форма показывает сценарий выбора услуги и проверки полей. Отправка на сервер не подключена.</p><div className={styles.nextSteps}><h3>В рабочей версии</h3><p>Контакты, цены и способ обработки заявок подключаются после подтверждения данных владельцем бизнеса.</p></div></div><EstimateForm onPrivacy={onPrivacy}/></div></div></section>
}
