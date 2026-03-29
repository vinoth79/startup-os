import React, { useState } from 'react'
import { useStore } from '../store/useStore'

const TYPE_PILL = {
  task: 'bg-green-500/10 text-green-400',
  agent: 'bg-blue-500/10 text-blue-400',
  milestone: 'bg-purple-500/10 text-purple-400',
  signal: 'bg-yellow-500/10 text-yellow-400',
  system: 'bg-card text-txt-4',
}

export default function SignalsFeed() {
  const { signals, stages, getConfidence } = useStore()
  const [filter, setFilter] = useState('all')

  const conf = getConfidence()
  const barColor = conf >= 80 ? 'bg-green-500' : conf >= 50 ? 'bg-yellow-500' : 'bg-red-500'
  const riskLabel = conf >= 80 ? 'Low Risk' : conf >= 50 ? 'Medium Risk' : 'High Risk'
  const riskColor = conf >= 80 ? 'text-green-400 bg-green-500/10 border-green-500/20' : conf >= 50 ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'

  const active = stages.find(s => s.status === 'active')
  const nextTask = active?.tasks.find(t => t.status !== 'done')
  const done = active?.tasks.filter(t => t.status === 'done').length || 0
  const total = active?.tasks.length || 1

  const filtered = filter === 'all' ? signals : signals.filter(s => s.type === filter)

  return (
    <aside className="w-64 flex-shrink-0 h-full flex flex-col border-l border-line-faint bg-panel">
      <div className="px-4 py-3.5 border-b border-line-faint">
        <h2 className="text-sm font-bold text-txt">Activity</h2>
        <p className="text-[10px] text-txt-4 mt-0.5">Live log — updates as you work through tasks</p>
      </div>

      {/* Confidence */}
      <div className="mx-3 mt-3 p-4 rounded-2xl bg-card border border-line">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[9px] font-bold text-txt-3 uppercase tracking-wider mono">Confidence Score</span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${riskColor}`}>{riskLabel}</span>
        </div>
        <div className="flex items-end gap-1.5 mb-2">
          <span className="text-3xl font-black mono text-txt">{conf}</span>
          <span className="text-txt-4 text-sm mb-0.5">/100</span>
        </div>
        <div className="h-2 rounded-full bg-card-hover overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${barColor}`} style={{ width: `${conf}%` }} />
        </div>
        {active && (
          <div className="mt-3 pt-3 border-t border-line-faint">
            <div className="flex justify-between text-[10px] text-txt-4 mb-1"><span>Stage progress</span><span>{done}/{total}</span></div>
            <div className="h-1 rounded-full bg-card-hover overflow-hidden">
              <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${(done / total) * 100}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Next action */}
      {nextTask && (
        <div className="mx-3 mt-2 p-3 rounded-xl bg-blue-500/8 border border-blue-500/20">
          <div className="text-[9px] font-bold text-blue-400 uppercase tracking-wider mb-1.5">Next action</div>
          <p className="text-xs text-txt font-semibold leading-relaxed">{nextTask.title}</p>
          <p className="text-[10px] text-txt-4 mt-0.5">{active?.name} · {nextTask.priority}</p>
        </div>
      )}

      {/* Filters */}
      <div className="mx-3 mt-2 flex gap-1">
        {['all', 'task', 'agent', 'milestone'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-1 py-1 text-[9px] font-medium rounded-lg transition-colors capitalize mono ${filter === f ? 'bg-card-hover text-txt' : 'text-txt-4 hover:text-txt-3'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {filtered.length === 0 ? (
          <div className="px-2 py-6 text-center">
            <div className="text-3xl mb-2">📡</div>
            <p className="text-sm font-semibold text-txt-3 mb-1">No signals yet</p>
            <p className="text-xs text-txt-4 leading-relaxed">
              Signals appear here as you complete tasks, run agents, and make decisions.
              Start with Task 1 to see your first signal.
            </p>
          </div>
        ) : (
          filtered.map(sig => (
            <div key={sig.id} className="flex gap-2.5 py-2 border-b border-line-faint last:border-0">
              <div className={`w-0.5 flex-shrink-0 rounded-full self-stretch ${sig.impact > 0 ? 'bg-green-400' : sig.impact < 0 ? 'bg-red-400' : 'bg-line'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded mono uppercase tracking-wide ${TYPE_PILL[sig.type] || TYPE_PILL.system}`}>{sig.type}</span>
                  {sig.impact !== 0 && (
                    <span className={`text-[9px] font-bold mono ${sig.impact > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {sig.impact > 0 ? '+' : ''}{sig.impact}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-txt-2 leading-relaxed">{sig.text}</p>
                <p className="text-[9px] text-txt-5 mono mt-1">{sig.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
