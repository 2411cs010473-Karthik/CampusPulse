import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts'
import { api } from '../services/api.js'
import { Title, Err, Loading, useLoad } from '../components/ui.jsx'
export default function Model() {
  const { data: m, error } = useLoad(api.model)
  if (error) return <Err msg={error} />
  if (!m) return <Loading />
  const trained = m.status === 'Trained', pct = (v) => (v * 100).toFixed(2) + '%'
  const curve = m.history ? m.history.loss.map((l, i) => ({ epoch: i + 1, 'Train loss': l, 'Val loss': m.history.val_loss[i] })) : []
  const stat = (l, v) => <div className="card"><p className="text-xs text-slate-500">{l}</p><p className="text-xl font-semibold">{v}</p></div>
  return <div><Title sub="Values below are read from saved_model/metrics.json produced by train_model.py">Model Performance</Title>
    {m.warning && <div className="rounded-xl bg-amber-50 text-amber-800 text-sm p-3 mb-4">{m.warning}</div>}
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">{stat('Status', <span className={trained ? 'text-emerald-600' : 'text-red-600'}>{m.status}</span>)}{stat('Model type', m.model_type)}{stat('Sentiment classes', 3)}
      {trained && <>{stat('Dataset size', `${m.dataset_size} (${m.train_size} train / ${m.val_size} val)`)}{stat('Training accuracy', pct(m.train_accuracy))}{stat('Validation accuracy', pct(m.val_accuracy))}</>}</div>
    {trained && <div className="grid lg:grid-cols-2 gap-4">
      <div className="card"><h3 className="font-medium mb-3">Training vs validation loss</h3><div className="h-64"><ResponsiveContainer><LineChart data={curve}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="epoch" /><YAxis /><Tooltip /><Legend /><Line dataKey="Train loss" stroke="#6366f1" strokeWidth={2} /><Line dataKey="Val loss" stroke="#ef4444" strokeWidth={2} /></LineChart></ResponsiveContainer></div></div>
      <div className="card"><h3 className="font-medium mb-3">Confusion matrix (validation)</h3><table className="text-sm text-center w-full"><thead><tr><th></th>{m.classes.map((c) => <th key={c} className="p-2">Pred {c}</th>)}</tr></thead><tbody>{m.confusion_matrix.map((r, i) => <tr key={i}><th className="p-2 text-left">True {m.classes[i]}</th>{r.map((v, j) => <td key={j} className={`p-3 rounded ${i === j ? 'bg-indigo-100 font-semibold' : 'bg-slate-50'}`}>{v}</td>)}</tr>)}</tbody></table></div>
      <div className="card lg:col-span-2"><h3 className="font-medium mb-3">Architecture</h3><pre className="text-xs bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto">{m.architecture.join('\n')}</pre><p className="text-xs text-slate-500 mt-3">{m.data_note}</p></div></div>}
  </div>
}
