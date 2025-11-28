// Componente para alternar tema dark/light
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });
  
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
    >
      <span
        className={`theme-toggle-icon${theme === 'dark' ? ' dark' : ''}`}
        aria-hidden="true"
      >
        {theme === 'light' ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
      </span>
    </button>
  );
}
