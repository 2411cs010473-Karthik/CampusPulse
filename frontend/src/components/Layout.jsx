import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, MessageSquareText, Upload, ListChecks, Lightbulb, Brain, Settings, LogOut, Search, Bell, Activity } from 'lucide-react'
const nav = [['/', 'Dashboard', LayoutDashboard], ['/analyze', 'Analyze Feedback', MessageSquareText], ['/upload', 'Bulk Upload', Upload], ['/feedback', 'Feedback Management', ListChecks], ['/insights', 'Insights & Reports', Lightbulb], ['/model', 'Model Performance', Brain], ['/settings', 'Settings', Settings]]
export default function Layout() {
  const nv = useNavigate(), [q, setQ] = useState(''), user = JSON.parse(localStorage.getItem('user') || '{}')
  const logout = () => { localStorage.clear(); window.location.href = '/login' }
  return <div className="min-h-screen">
    <aside className="fixed inset-y-0 left-0 w-60 bg-navy text-slate-300 flex flex-col p-4">
      <div className="flex items-center gap-2 px-2 py-3 mb-4 text-white font-semibold"><div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 grid place-items-center"><Activity size={18} /></div>CampusPulse AI</div>
      <nav className="flex-1 space-y-1">{nav.map(([to, label, I]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-white/10'}`}><I size={18} />{label}</NavLink>)}</nav>
      <button onClick={logout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/10"><LogOut size={18} />Logout</button>
    </aside>
    <div className="ml-60">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-100 px-8 h-16 flex items-center justify-between">
        <form onSubmit={(e) => { e.preventDefault(); nv('/feedback?q=' + encodeURIComponent(q)) }} className="relative w-80"><Search size={16} className="absolute left-3 top-3 text-slate-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search feedback…" className="input pl-9" /></form>
        <div className="flex items-center gap-5"><button onClick={() => nv('/insights')} title="Insights"><Bell size={20} className="text-slate-500" /></button>
          <div className="flex items-center gap-2"><div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white grid place-items-center text-sm">{(user.name || 'A')[0]}</div><div className="text-sm"><p className="font-medium leading-4">{user.name}</p><p className="text-xs text-slate-400">Administrator</p></div></div></div>
      </header>
      <main className="p-8"><Outlet /></main>
    </div></div>
}
