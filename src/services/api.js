
// Frankfurter API 封裝（修正版：幣別一律正規化為大寫）
export async function getLatestRates(from = 'USD') {
  const base = String(from).toUpperCase();
  const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  return data; // { amount, base, date, rates: { TWD: number, ... } }
}

export async function getHistoryRates(from = 'USD', to = 'TWD', days = 30) {
  const F = String(from).toUpperCase();
  const T = String(to).toUpperCase();
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  const toStr = (d) => d.toISOString().slice(0,10);
  const url = `https://api.frankfurter.app/${toStr(start)}..${toStr(end)}?from=${encodeURIComponent(F)}&to=${encodeURIComponent(T)}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  const rates = data.rates || {};
  const labels = Object.keys(rates).sort();
  const values = labels.map((date) => rates[date][T]);
  return { labels, values };
}
