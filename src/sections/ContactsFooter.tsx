import { media, navigation } from '../data/content'
import styles from '../styles/site.module.css'
import { Container, Media } from '../components/ui'

export function Contacts() {
  return <section id="contacts" className={`${styles.section} ${styles.contactsSection}`}><Container className={styles.contactsGrid}>
    <div><h2>Как может выглядеть контактный блок</h2><p className={styles.lead}>Реальные контакты и схема проезда подключаются при адаптации сайта под бизнес.</p><div className={styles.contactChannels}><article><strong>WhatsApp</strong><span>Не подключено в демо</span></article><article><strong>Telegram</strong><span>Не подключено в демо</span></article><article><strong>Телефон</strong><span>Не подключено в демо</span></article></div></div>
    <div className={styles.mapPlaceholder}><Media src={media.contact} label="Демонстрационное изображение рабочей зоны детейлинг-студии"/><div><strong>Место для маршрута</strong><p>Карта появится после подтверждения фактического адреса.</p></div></div>
  </Container></section>
}

export function Footer({ onPrivacy }: { onPrivacy: () => void }) {
  return <footer className={styles.footer}><Container><div className={styles.footerGrid}><div><strong className={styles.footerBrand}>MOTIVE Detail Studio</strong><p>PPF · Полировка · Защитные покрытия · Интерьер · Тонировка</p></div><nav aria-label="Навигация в подвале">{navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav><div><button onClick={onPrivacy}>Политика конфиденциальности</button><p>© {new Date().getFullYear()} MOTIVE Detail Studio</p></div></div><p className={styles.disclosure}>Концепт сайта. MOTIVE Detail Studio — вымышленный бренд. Демонстрационные кейсы не являются реальными работами.</p></Container></footer>
}
