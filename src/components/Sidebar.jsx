import React from 'react'
import { useStore } from '../store/useStore'

const NAV = [
  { id: 'operating', label: 'Operating', icon: '🎯' },
  { id: 'workspace', label: 'Workspace', icon: '📋' },
  { id: 'company', label: 'Company', icon: '🏢' },
  { id: 'financials', label: 'Financials', icon: '💰' },
  { id: 'agents', label: 'Agents', icon: '🤖' },
  { id: 'history', label: 'History', icon: '📜' },
]

export default function Sidebar() {
  const { page, setPage, startup, theme, toggleTheme, resetAll } = useStore()

  return (
    <aside className="w-52 flex-shrink-0 h-full flex flex-col border-r border-line-faint bg-panel">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-line-faint">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[11px] font-black text-white flex-shrink-0 shadow-lg shadow-blue-500/30">OS</div>
          <div>
            <div className="text-sm font-bold text-txt truncate max-w-[130px]">{startup.name}</div>
            <div className="text-[11px] text-txt-4 truncate">{startup.industry}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
        {NAV.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group
              ${page === item.id
                ? 'bg-card-hover text-txt font-semibold'
                : 'text-txt-3 hover:text-txt-2 hover:bg-card'}`}>
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
            {page === item.id && <div className="ml-auto w-1 h-4 rounded-full bg-blue-400" />}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 pb-3 pt-2 border-t border-line-faint space-y-0.5">
        <button onClick={toggleTheme} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-txt-4 hover:text-txt-2 hover:bg-card transition-all">
          <span>{theme === 'dark' ? '☀' : '◗'}</span>
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
        <button onClick={() => confirm('Reset everything and start fresh?') && resetAll()} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-txt-5 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <span>↺</span><span>Reset</span>
        </button>
      </div>
    </aside>
  )
}
