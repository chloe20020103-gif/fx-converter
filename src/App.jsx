
import { useState } from 'react';
import CurrencyConverter from './components/CurrencyConverter';
import HistoryChart from './components/HistoryChart';
import './index.css';

export default function App() {
  const [theme, setTheme] = useState('light');

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <h1>匯率轉換器（修正版）</h1>
        <div className="header-actions">
          <button onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))} aria-label="切換主題">
            {theme === 'light' ? '🌙 深色' : '☀️ 淺色'}
          </button>
        </div>
      </header>

      <main className="container">
        <CurrencyConverter />
        <HistoryChart />
      </main>

      <footer className="footer">
        <small>資料來源：Frankfurter API（示範用）</small>
      </footer>
    </div>
  );
}
