import React from 'react'
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts'
import { MessageSquare, ThumbsUp, ThumbsDown, Minus, Smile, CalendarDays } from 'lucide-react'
import { api } from '../services/api.js'
import { Kpi, Title, Err, Loading, Badge, useLoad, COLORS, ModelBanner } from '../components/ui.jsx'
const Chart = ({ title, children }) => <div className="card"><h3 className="font-medium mb-3">{title}</h3><div className="h-64"><ResponsiveContainer>{children}</ResponsiveContainer></div></div>
export default function Dashboard() {
  const { data: d, error } = useLoad(api.dashboard)
  if (error) return <Err msg={error} />
  if (!d) return <Loading />
  const cmp = d.categories.map((c) => ({ name: c.name, Positive: c.Positive, Negative: c.Negative }))
  return <div>
    <Title sub="Demo data is synthetic. Sentiments are predicted by the model.">Dashboard</Title><ModelBanner type={d.model_type} />
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
      <Kpi icon={MessageSquare} label="Total feedback" value={d.total} /><Kpi icon={ThumbsUp} label="Positive" value={d.positive_pct + '%'} tone="from-emerald-500 to-teal-500" />
      <Kpi icon={ThumbsDown} label="Negative" value={d.negative_pct + '%'} tone="from-rose-500 to-red-500" /><Kpi icon={Minus} label="Neutral" value={d.neutral_pct + '%'} tone="from-amber-500 to-orange-500" />
      <Kpi icon={Smile} label="Satisfaction score" value={d.satisfaction + '/100'} tone="from-blue-500 to-indigo-500" /><Kpi icon={CalendarDays} label="This month" value={d.this_month} tone="from-purple-500 to-fuchsia-500" /></div>
    <div className="grid lg:grid-cols-2 gap-4 mb-4">
      <Chart title="Sentiment distribution"><PieChart><Pie data={d.distribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} label>{d.distribution.map((e) => <Cell key={e.name} fill={COLORS[e.name]} />)}</Pie><Tooltip /><Legend /></PieChart></Chart>
      <Chart title="Feedback trend (last 30 days)"><LineChart data={d.trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" fontSize={11} /><YAxis allowDecimals={false} /><Tooltip /><Legend />{['Positive', 'Negative', 'Neutral'].map((s) => <Line key={s} dataKey={s} stroke={COLORS[s]} dot={false} strokeWidth={2} />)}</LineChart></Chart>
      <Chart title="Category-wise sentiment"><BarChart data={d.categories}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis /><Tooltip /><Legend />{['Positive', 'Neutral', 'Negative'].map((s) => <Bar key={s} dataKey={s} stackId="a" fill={COLORS[s]} />)}</BarChart></Chart>
      <Chart title="Department-wise satisfaction (%)"><BarChart data={d.departments} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" domain={[0, 100]} /><YAxis type="category" dataKey="name" width={130} fontSize={11} /><Tooltip /><Bar dataKey="satisfaction" fill="#6366f1" radius={6} /></BarChart></Chart>
      <Chart title="Positive vs negative by category"><BarChart data={cmp}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis /><Tooltip /><Legend /><Bar dataKey="Positive" fill={COLORS.Positive} radius={4} /><Bar dataKey="Negative" fill={COLORS.Negative} radius={4} /></BarChart></Chart>
      <div className="card"><h3 className="font-medium mb-3">Most common concerns <span className="text-xs text-slate-400">(keyword frequency)</span></h3><div className="flex flex-wrap gap-2">{d.concerns.map((c) => <span key={c.term} className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-sm">{c.term} · {c.count}</span>)}</div>
        <h3 className="font-medium mt-5 mb-2">Top-performing areas</h3>{d.top_areas.map((a) => <p key={a.name} className="text-sm flex justify-between"><span>{a.name}</span><b className="text-emerald-600">{a.satisfaction}%</b></p>)}
        <h3 className="font-medium mt-5 mb-2">Needs immediate attention</h3>{d.attention.map((a) => <p key={a.name} className="text-sm flex justify-between"><span>{a.name}</span><b className="text-red-600">{a.satisfaction}%</b></p>)}</div></div>
    <div className="card overflow-x-auto"><h3 className="font-medium mb-3">Recent feedback</h3><table className="w-full text-sm"><thead className="text-left text-slate-500"><tr><th className="py-2">Feedback</th><th>Category</th><th>Sentiment</th><th>Date</th></tr></thead>
      <tbody>{d.recent.map((r) => <tr key={r.id} className="border-t border-slate-100"><td className="py-2 pr-4">{r.text}</td><td>{r.category}</td><td><Badge s={r.sentiment} /></td><td>{r.date}</td></tr>)}</tbody></table></div></div>
}
