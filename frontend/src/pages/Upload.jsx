import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { UploadCloud } from 'lucide-react'
import { api } from '../services/api.js'
import { Title, Err } from '../components/ui.jsx'
export default function Upload() {
  const [file, setFile] = useState(null), [res, setRes] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const go = async () => { setBusy(true); setError(''); setRes(null); try { setRes(await api.upload(file)) } catch (e) { setError(e.message) } setBusy(false) }
  return <div className="max-w-2xl"><Title sub="CSV columns required: feedback, category, department">Bulk Upload</Title><Err msg={error} />
    <div className="card space-y-4"><label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 grid place-items-center text-center cursor-pointer hover:border-indigo-300"><UploadCloud className="text-indigo-500 mb-2" /><span className="text-sm">{file ? file.name : 'Click to choose a .csv file'}</span>
      <input type="file" accept=".csv" className="hidden" onChange={(e) => setFile(e.target.files[0])} /></label>
      <div className="flex gap-3 items-center"><button className="btn" disabled={!file || busy} onClick={go}>{busy ? 'Processing…' : 'Upload & analyze'}</button><span className="text-xs text-slate-500">Valid categories/departments only.</span></div></div>
    {res && <div className="card mt-4"><p className="text-emerald-700 font-medium">{res.saved} rows analyzed and saved ({res.model_type})</p>{res.rejected > 0 && <><p className="text-red-700 mt-2 font-medium">{res.rejected} rows rejected</p><ul className="text-sm text-slate-600 list-disc ml-5">{res.errors.map((e) => <li key={e}>{e}</li>)}</ul></>}
      <Link to="/" className="text-indigo-600 underline text-sm">View updated dashboard</Link></div>}</div>
}
