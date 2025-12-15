
import { useEffect, useMemo, useState } from 'react';
import { getLatestRates } from '../services/api';

const COMMONS = ['USD', 'EUR', 'JPY', 'TWD', 'CNY', 'GBP', 'AUD', 'CAD'];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('TWD');
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true); setErr('');
    getLatestRates(from)
      .then(data => { if (!mounted) return; setRates(data?.rates ?? {}); })
      .catch(() => { if (!mounted) return; setErr('無法取得匯率，請稍後再試'); })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [from]);

  const result = useMemo(() => {
    const amt = Number(amount);
    if (!rates || !to || !amt) return 0;
    const F = String(from).toUpperCase();
    const T = String(to).toUpperCase();
    if (F === T) return amt; // 同幣別
    const rate = rates[T];
    if (!rate) return 0;
    return amt * rate;
  }, [amount, to, rates, from]);

  return (
    <section className="card">
      <h2 className="card-title">即時匯率轉換</h2>
      <div className="grid">
        <div className="field">
          <label htmlFor="amount">金額</label>
          <input id="amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="from">來源幣別</label>
          <select id="from" value={from} onChange={(e) => setFrom(e.target.value.toUpperCase())}>
            {COMMONS.map(code => (<option key={code} value={code}>{code}</option>))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="to">目標幣別</label>
          <select id="to" value={to} onChange={(e) => setTo(e.target.value.toUpperCase())}>
            {COMMONS.map(code => (<option key={code} value={code}>{code}</option>))}
          </select>
        </div>
      </div>
      <div className="result">
        {loading ? (
          <span>更新匯率中…</span>
        ) : err ? (
          <span className="error">{err}</span>
        ) : (result === 0 && String(from).toUpperCase() !== String(to).toUpperCase()) ? (
          <span className="error">目前無法取得 {String(from).toUpperCase()} → {String(to).toUpperCase()} 的匯率，請稍後再試或改用其他幣別。</span>
        ) : (
          <span>
            {amount} {String(from).toUpperCase()} ≈ <strong>{Number(result).toFixed(2)} {String(to).toUpperCase()}</strong>
          </span>
        )}
      </div>
      <details className="hint">
        <summary>小提示</summary>
        <ul>
          <li>幣別代碼自動轉為大寫（ISO 4217）。</li>
          <li>若來源與目標相同，直接顯示原金額。</li>
        </ul>
      </details>
    </section>
  );
}
