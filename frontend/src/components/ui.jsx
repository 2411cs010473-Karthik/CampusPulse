import React, { useEffect, useState } from 'react'
export const COLORS = { Positive: '#10b981', Negative: '#ef4444', Neutral: '#f59e0b' }
export function Badge({ s }) {
  const c = { Positive: 'bg-emerald-50 text-emerald-700', Negative: 'bg-red-50 text-red-700', Neutral: 'bg-amber-50 text-amber-700' }[s]
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c}`}>{s}</span>
}
export function Kpi({ icon: Icon, label, value, tone = 'from-indigo-500 to-purple-500' }) {
  return <div className="card flex items-center gap-4"><div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${tone} grid place-items-center text-white`}><Icon size={22} /></div>
    <div><p className="text-xs text-slate-500">{label}</p><p className="text-2xl font-semibold">{value}</p></div></div>
}
export function Title({ children, sub }) { return <div className="mb-6"><h1 className="text-2xl font-semibold">{children}</h1>{sub && <p className="text-sm text-slate-500 mt-1">{sub}</p>}</div> }
export function Err({ msg }) { return msg ? <div className="rounded-xl bg-red-50 text-red-700 text-sm p-3 mb-4">{msg}</div> : null }
export function useLoad(fn, deps = []) {
  const [data, setData] = useState(null), [error, setError] = useState('')
  useEffect(() => { setError(''); fn().then(setData).catch((e) => setError(e.message)) }, deps)
  return { data, error }
}
export const Loading = () => <p className="text-slate-400 text-sm">Loading…</p>
export function ModelBanner({ type }) {
  return type && type !== 'LSTM' ? <div className="rounded-xl bg-amber-50 text-amber-800 text-sm p-3 mb-4">Demo fallback active (TF-IDF + logistic regression, not deep learning). Run train_model.py and restart the backend to use the LSTM.</div> : null
}
