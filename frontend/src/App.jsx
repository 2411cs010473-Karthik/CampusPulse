import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Analyze from './pages/Analyze.jsx'
import Upload from './pages/Upload.jsx'
import FeedbackList from './pages/FeedbackList.jsx'
import Insights from './pages/Insights.jsx'
import Model from './pages/Model.jsx'
import Settings from './pages/Settings.jsx'
export default function App() {
  const authed = !!localStorage.getItem('token')
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={authed ? <Layout /> : <Navigate to="/login" />}>
      <Route path="/" element={<Dashboard />} /><Route path="/analyze" element={<Analyze />} /><Route path="/upload" element={<Upload />} />
      <Route path="/feedback" element={<FeedbackList />} /><Route path="/insights" element={<Insights />} /><Route path="/model" element={<Model />} /><Route path="/settings" element={<Settings />} />
    </Route>
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
}
