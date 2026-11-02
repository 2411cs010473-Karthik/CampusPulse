import React from 'react'
import { api } from '../services/api.js'
import { Title, Err, Loading, useLoad } from '../components/ui.jsx'
export default function Settings() {
  const { data: h, error } = useLoad(api.health), u = JSON.parse(localStorage.getItem('user') || '{}')
  const row = (k, v) => <div className="flex justify-between py-2 border-t border-slate-100 text-sm"><span className="text-slate-500">{k}</span><span className="font-medium">{v}</span></div>
  return <div className="max-w-xl"><Title sub="Account and system status">Settings</Title><Err msg={error} />
    <div className="card mb-4"><h3 className="font-medium mb-2">Administrator</h3>{row('Name', u.name)}{row('Email', u.email)}</div>
    <div className="card"><h3 className="font-medium mb-2">System status</h3>{!h ? <Loading /> : <>{row('Backend', h.status)}{row('Database', h.database)}{row('Active model', h.model_type)}{row('LSTM trained & loaded', h.lstm_trained ? 'Yes' : 'No')}</>}</div></div>
}
