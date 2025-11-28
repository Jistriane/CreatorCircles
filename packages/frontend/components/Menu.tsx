import Link from 'next/link';
import styles from '../styles/circles.module.css';


export default function Menu() {
  return (
    <nav className={styles.container} style={{marginBottom:24, display:'flex', justifyContent:'center', gap:32}}>
      <Link href="/" style={{display:'flex',alignItems:'center',gap:8}}>
        <span role="img" aria-label="explorar">🌐</span> <span>Explorar Círculos</span>
      </Link>
      <Link href="/dashboard" style={{display:'flex',alignItems:'center',gap:8}}>
        <span role="img" aria-label="dashboard">📊</span> <span>Dashboard</span>
      </Link>
      <Link href="/governanca" style={{display:'flex',alignItems:'center',gap:8}}>
        <span role="img" aria-label="governança">🗳️</span> <span>Governança</span>
      </Link>
    </nav>
  );
}
