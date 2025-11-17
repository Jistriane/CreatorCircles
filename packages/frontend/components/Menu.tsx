import Link from 'next/link';
import styles from '../styles/circles.module.css';

export default function Menu() {
  return (
    <nav className={styles.container} style={{marginBottom:24}}>
      <Link href="/">Explorar Círculos</Link> |{' '}
      <Link href="/dashboard">Dashboard</Link> |{' '}
      <Link href="/governanca">Governança</Link>
    </nav>
  );
}
