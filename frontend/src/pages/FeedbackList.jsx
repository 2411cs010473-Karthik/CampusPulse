import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Download } from 'lucide-react'
import { api } from '../services/api.js'
import { Title, Err, Badge, Loading, useLoad } from '../components/ui.jsx'
export default function FeedbackList() {
  const [sp] = useSearchParams(), { data: meta } = useLoad(api.meta)
  const [f, setF] = useState({ q: sp.get('q') || '', sentiment: '', category: '', department: '' })
  const { data, error } = useLoad(() => api.feedback(f), [f.q, f.sentiment, f.category, f.department, sp.get('q')])
  const sel = (k, label, opts) => <select className="input" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })}><option value="">{label}</option>{opts.map((o) => <option key={o}>{o}</option>)}</select>
  return <div><Title sub="All stored feedback with model predictions">Feedback Management</Title><Err msg={error} />
    <div className="card mb-4 grid md:grid-cols-5 gap-3"><input className="input" placeholder="Search text…" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} />{sel('sentiment', 'All sentiments', ['Positive', 'Negative', 'Neutral'])}{sel('category', 'All categories', meta?.categories || [])}{sel('department', 'All departments', meta?.departments || [])}
      <button className="btn" onClick={() => api.downloadCsv(f)}><Download size={16} />Export CSV</button></div>
    {!data ? <Loading /> : <div className="card overflow-x-auto"><p className="text-xs text-slate-500 mb-2">{data.total} results{data.total > 500 && ' (showing first 500)'}</p><table className="w-full text-sm"><thead className="text-left text-slate-500"><tr><th className="py-2">Feedback</th><th>Category</th><th>Department</th><th>Sentiment</th><th>Conf.</th><th>Date</th></tr></thead>
      <tbody>{data.items.map((r) => <tr key={r.id} className="border-t border-slate-100"><td className="py-2 pr-4 max-w-md">{r.text}</td><td>{r.category}</td><td>{r.department}</td><td><Badge s={r.sentiment} /></td><td>{(r.confidence * 100).toFixed(0)}%</td><td>{r.date}</td></tr>)}</tbody></table></div>}</div>
}
