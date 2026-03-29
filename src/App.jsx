import React, { useEffect } from 'react'
import { useStore } from './store/useStore'
import Sidebar from './components/Sidebar'
import SignalsFeed from './components/SignalsFeed'
import Operating from './components/Operating'
import Workspace from './components/Workspace'
import Company from './components/Company'
import Financials from './components/Financials'
import Agents from './components/Agents'
import History from './components/History'
import Onboarding from './components/Onboarding'

const PAGES = {
  operating: Operating,
  workspace: Workspace,
  company: Company,
  financials: Financials,
  agents: Agents,
  history: History,
}

export default function App() {
  const { page, onboarded, theme } = useStore()

  useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  // Keyboard shortcuts
  useEffect(() => {
    const { setPage } = useStore.getState()
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      const shortcuts = { '1': 'operating', '2': 'workspace', '3': 'company', '4': 'financials', '5': 'agents', '6': 'history' }
      if (shortcuts[e.key]) setPage(shortcuts[e.key])
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const PageComponent = PAGES[page] || Operating

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      {!onboarded && <Onboarding />}

      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl" />
      </div>

      <Sidebar />

      <main className="flex-1 overflow-hidden min-w-0 relative">
        <PageComponent />
      </main>

      <SignalsFeed />
    </div>
  )
}
