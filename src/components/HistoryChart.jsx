
import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { getHistoryRates } from '../services/api';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const COMMONS = ['USD', 'EUR', 'JPY', 'TWD', 'CNY', 'GBP'];
const RANGES = [7, 30, 90];

export default function HistoryChart() {
  const [base, setBase] = useState('USD');
  const [to, setTo] = useState('TWD');
  const [days, setDays] = useState(30);
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true); setErr('');
    getHistoryRates(base, to, days)
      .then(({ labels, values }) => { if (!mounted) return; setLabels(labels); setSeries(values); })
      .catch(() => { if (!mounted) return; setErr('無法取得歷史匯率'); })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [base, to, days]);

  const data = useMemo(() => {
    const B = String(base).toUpperCase();
    const T = String(to).toUpperCase();
    const values = (B === T) ? labels.map(() => 1) : series;
    return {
      labels,
      datasets: [{ label: `${B} → ${T}`, data: values, borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.2)', tension: 0.2, pointRadius: 2 }]
    };
  }, [labels, series, base, to]);

  const options = { responsive: true, plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } }, scales: { x: { display: true }, y: { display: true } } };

  return (
    <section className="card" style={{ marginTop: 16 }}>
      <h2 className="card-title">歷史匯率走勢</h2>
      <div className="grid">
        <div className="field">
          <label>來源幣別</label>
          <select value={base} onChange={(e) => setBase(e.target.value.toUpperCase())}>{COMMONS.map(c => <option key={c} value={c}>{c}</option>)}</select>
        </div>
        <div className="field">
          <label>目標幣別</label>
          <select value={to} onChange={(e) => setTo(e.target.value.toUpperCase())}>{COMMONS.map(c => <option key={c} value={c}>{c}</option>)}</select>
        </div>
        <div className="field">
          <label>時間範圍</label>
          <select value={days} onChange={(e) => setDays(Number(e.target.value))}>{RANGES.map(d => <option key={d} value={d}>{d} 天</option>)}</select>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        {loading ? (<div>載入中…</div>) : err ? (<div className="error">{err}</div>) : (<Line data={data} options={options} />)}
      </div>
    </section>
  );
}
