import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { api } from '../services/api.js'
import { Title, Err, Badge, useLoad, ModelBanner } from '../components/ui.jsx'
export default function Analyze() {
  const { data: meta } = useLoad(api.meta)
  const [f, setF] = useState({ feedback: '', category: '', department: '' }), [res, setRes] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const submit = async (e) => { e.preventDefault(); setBusy(true); setError(''); setRes(null)
    try { setRes(await api.analyze(f)) } catch (er) { setError(er.message) } setBusy(false) }
  const sel = (k, label, opts) => <div><label className="text-sm font-medium">{label}</label><select required className="input mt-1" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })}><option value="">Select…</option>{opts.map((o) => <option key={o}>{o}</option>)}</select></div>
  return <div className="max-w-2xl"><Title sub="Preprocess → tokenize → LSTM → sentiment + confidence → saved to SQLite">Analyze Feedback</Title><Err msg={error} />
    <form onSubmit={submit} className="card space-y-4"><div><label className="text-sm font-medium">Student feedback</label><textarea required minLength={5} rows={5} className="input mt-1" value={f.feedback} onChange={(e) => setF({ ...f, feedback: e.target.value })} placeholder="e.g. The hostel food quality is poor and the rooms are dirty." /></div>
      <div className="grid sm:grid-cols-2 gap-4">{sel('category', 'University category', meta?.categories || [])}{sel('department', 'Department', meta?.departments || [])}</div>
      <button className="btn" disabled={busy}><Sparkles size={16} />{busy ? 'Analyzing…' : 'Analyze & save'}</button></form>
    {res && <div className="card mt-4"><ModelBanner type={res.model_type} /><p className="text-sm text-slate-500 mb-2">Predicted sentiment ({res.model_type})</p><div className="flex items-center gap-4"><Badge s={res.sentiment} /><span className="text-lg font-semibold">{(res.confidence * 100).toFixed(1)}% confidence</span></div>
      <div className="h-2 bg-slate-100 rounded-full mt-3"><div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: res.confidence * 100 + '%' }} /></div>
      <p className="text-sm mt-3 text-slate-500">Saved. <Link className="text-indigo-600 underline" to="/">View updated dashboard</Link></p></div>}</div>
}
