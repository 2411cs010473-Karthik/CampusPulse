import React, { useState } from 'react'
import { Activity, Eye, EyeOff } from 'lucide-react'
import { api } from '../services/api.js'
import { Err } from '../components/ui.jsx'
export default function Login() {
  const [email, setEmail] = useState('admin@campuspulse.edu'), [pw, setPw] = useState(''), [show, setShow] = useState(false), [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const submit = async (e) => { e.preventDefault(); setBusy(true); setError('')
    try { const r = await api.login(email, pw); localStorage.setItem('token', r.token); localStorage.setItem('user', JSON.stringify(r.user)); window.location.href = '/' } catch (er) { setError(er.message) } setBusy(false) }
  return <div className="min-h-screen grid place-items-center bg-gradient-to-br from-navy via-indigo-900 to-purple-700 p-4">
    <form onSubmit={submit} className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
      <div className="flex items-center gap-3 mb-6"><div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 grid place-items-center text-white"><Activity /></div><div><h1 className="font-semibold text-lg">CampusPulse AI</h1><p className="text-xs text-slate-500">University Feedback Analytics</p></div></div>
      <Err msg={error} />
      <label className="text-sm font-medium">Email</label><input className="input mt-1 mb-4" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label className="text-sm font-medium">Password</label>
      <div className="relative mt-1 mb-6"><input className="input pr-10" type={show ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} required /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-slate-400">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
      <button className="btn w-full" disabled={busy}>{busy ? 'Signing in…' : 'Login'}</button>
      <p className="text-xs text-slate-500 mt-4 text-center">Demo admin: admin@campuspulse.edu / Admin@123</p>
    </form></div>
}
