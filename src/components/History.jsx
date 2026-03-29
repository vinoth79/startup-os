import React, { useState } from 'react'
import { useStore } from '../store/useStore'

const TYPE_COLORS = {
  Decision: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Agent: 'text-green-400 bg-green-500/10 border-green-500/20',
  Signal: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  Task: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  Stage: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  Milestone: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
}
const DOT_COLORS = {
  Decision: 'bg-blue-400', Agent: 'bg-green-400', Signal: 'bg-yellow-400',
  Task: 'bg-purple-400', Stage: 'bg-orange-400', Milestone: 'bg-pink-400',
}

export default function History() {
  const { history, stages, getConfidence } = useStore()
  const [filter, setFilter] = useState('all')

  const types = ['all', 'Decision', 'Agent', 'Task', 'Signal', 'Stage']
  const filtered = filter === 'all' ? history : history.filter(h => h.type === filter)

  const conf = getConfidence()
  const completedStages = stages.filter(s => s.status === 'completed')
  const totalTasks = stages.flatMap(s => s.tasks)
  const doneTasks = totalTasks.filter(t => t.status === 'done')

  return (
    <div className="h-full overflow-hidden grid grid-cols-[1fr_260px]">
      {/* Main */}
      <div className="overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-txt">History</h2>
            <p className="text-xs text-txt-4 mt-1">{history.length} recorded events</p>
          </div>
          {/* Filters */}
          <div className="flex gap-1">
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${filter === t ? 'bg-card-hover text-txt border-line-strong' : 'text-txt-4 border-transparent hover:text-txt-2'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-3.5 top-0 bottom-0 w-px bg-line" />
          <div className="space-y-4">
            {filtered.map(item => (
              <div key={item.id} className="flex gap-4">
                <div className="flex-shrink-0 z-10 mt-1">
                  <div className={`w-3 h-3 rounded-full border-2 border-base ${DOT_COLORS[item.type] || 'bg-txt-5'}`} />
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-start gap-2 mb-1.5 flex-wrap">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border mono ${TYPE_COLORS[item.type] || 'text-txt-4 bg-card border-line'}`}>{item.type}</span>
                    {item.stage && <span className="text-[9px] text-txt-5 bg-card px-2 py-0.5 rounded-full border border-line">{item.stage}</span>}
                    <span className="text-[9px] text-txt-5 mono ml-auto flex-shrink-0">{item.time}</span>
                  </div>
                  <p className="text-sm font-medium text-txt leading-relaxed">{item.text}</p>
                  {item.impact && (
                    <span className={`text-[10px] font-bold mono mt-1.5 inline-block px-2 py-0.5 rounded-full ${item.impact.startsWith('+') ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                      {item.impact}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center text-txt-5 text-sm py-12 pl-8">No {filter} events recorded yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Stats panel */}
      <div className="border-l border-line-faint overflow-y-auto p-4 bg-panel space-y-4">
        <div className="text-[9px] mono font-bold text-txt-5 uppercase tracking-widest mb-3">Stats</div>

        {[
          { label: 'Total Events', val: history.length, color: 'text-txt' },
          { label: 'Decisions', val: history.filter(h => h.type === 'Decision').length, color: 'text-blue-400' },
          { label: 'Agent Actions', val: history.filter(h => h.type === 'Agent').length, color: 'text-green-400' },
          { label: 'Tasks Done', val: doneTasks.length, color: 'text-purple-400' },
          { label: 'Confidence', val: `${conf}%`, color: conf >= 80 ? 'text-green-400' : conf >= 50 ? 'text-yellow-400' : 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="p-3.5 rounded-xl bg-card border border-line">
            <div className="text-[10px] text-txt-4 mb-1">{s.label}</div>
            <div className={`text-2xl font-black mono ${s.color}`}>{s.val}</div>
          </div>
        ))}

        <div className="text-[9px] mono font-bold text-txt-5 uppercase tracking-widest mt-4 mb-3">Stage Progress</div>
        {stages.map(s => {
          const c = s.status === 'completed' ? 'bg-green-500' : s.status === 'active' ? 'bg-blue-400 animate-pulse' : 'bg-txt-5'
          const tc = s.status === 'active' ? 'text-txt' : s.status === 'completed' ? 'text-txt-4 line-through' : 'text-txt-5'
          return (
            <div key={s.id} className={`flex items-center gap-2 py-1.5 px-2.5 rounded-xl mb-1 border ${s.status === 'active' ? 'bg-blue-500/5 border-blue-500/15' : 'bg-card border-line-faint'}`}>
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c}`} />
              <span className={`text-[11px] flex-1 ${tc}`}>{s.name}</span>
              <span className="text-[9px] mono text-txt-5">{s.status === 'completed' ? '✓' : s.status === 'active' ? `${s.pct}%` : '🔒'}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
