import React from 'react'
import { Download } from 'lucide-react'
import { api } from '../services/api.js'
import { Title, Err, Loading, useLoad } from '../components/ui.jsx'
const Terms = ({ title, items, cls }) => <div className="card"><h3 className="font-medium mb-3">{title}</h3><div className="flex flex-wrap gap-2">{items.map((c) => <span key={c.term} className={`px-3 py-1 rounded-full text-sm ${cls}`}>{c.term} · {c.count}</span>)}</div></div>
const Rank = ({ title, items, cls }) => <div className="card"><h3 className="font-medium mb-3">{title}</h3>{items.map((a) => <p key={a.name} className="text-sm flex justify-between py-1"><span>{a.name}</span><b className={cls}>{a.satisfaction}%</b></p>)}</div>
export default function Insights() {
  const { data: d, error } = useLoad(api.insights)
  if (error) return <Err msg={error} />
  if (!d) return <Loading />
  return <div><Title sub={d.note}>Insights & Reports</Title>
    <div className="rounded-xl bg-indigo-50 text-indigo-800 text-sm p-3 mb-4">Keyword lists below are simple term-frequency counts (not deep learning). They are computed over feedback that the sentiment model labelled Negative or Positive.</div>
    <div className="grid lg:grid-cols-2 gap-4"><Terms title="Most common complaints (keywords)" items={d.complaints} cls="bg-red-50 text-red-700" /><Terms title="Frequently mentioned positives (keywords)" items={d.praise} cls="bg-emerald-50 text-emerald-700" />
      <Rank title="Highest-satisfaction departments" items={d.best_departments} cls="text-emerald-600" /><Rank title="Lowest-satisfaction departments" items={d.worst_departments} cls="text-red-600" /><Rank title="Categories requiring improvement" items={d.improve_categories} cls="text-red-600" />
      <div className="card"><h3 className="font-medium mb-3">Download reports</h3><div className="flex flex-wrap gap-3"><button className="btn" onClick={() => api.downloadCsv({})}><Download size={16} />All feedback</button><button className="btn" onClick={() => api.downloadCsv({ sentiment: 'Negative' })}><Download size={16} />Negative only</button></div></div></div></div>
}
