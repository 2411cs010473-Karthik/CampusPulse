const tok = () => localStorage.getItem('token')
async function req(path, opts = {}) {
  const headers = { ...(opts.body && !(opts.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), Authorization: 'Bearer ' + tok() }
  let res
  try { res = await fetch('/api' + path, { ...opts, headers }) } catch { throw new Error('Cannot reach backend on port 5000. Is Flask running?') }
  if (res.status === 401 && path !== '/login') { localStorage.removeItem('token'); window.location.href = '/login' }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}
const qs = (o) => new URLSearchParams(Object.fromEntries(Object.entries(o).filter(([, v]) => v))).toString()
export const api = {
  login: (email, password) => req('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  meta: () => req('/meta'), health: () => req('/health'), dashboard: () => req('/dashboard'), insights: () => req('/insights'), model: () => req('/model-performance'),
  analyze: (b) => req('/analyze', { method: 'POST', body: JSON.stringify(b) }),
  upload: (file) => { const f = new FormData(); f.append('file', file); return req('/upload', { method: 'POST', body: f }) },
  feedback: (f) => req('/feedback?' + qs(f)),
  csvUrl: (f) => '/api/feedback?' + qs({ ...f, format: 'csv' }),
  downloadCsv: async (f) => { const r = await fetch('/api/feedback?' + qs({ ...f, format: 'csv' }), { headers: { Authorization: 'Bearer ' + tok() } }); const u = URL.createObjectURL(await r.blob()); const a = document.createElement('a'); a.href = u; a.download = 'feedback_report.csv'; a.click() },
}
