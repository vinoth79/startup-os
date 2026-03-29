import React from 'react'
import { useStore } from '../store/useStore'

export default function Agents() {
  const { agents, triggerAgent, resetAgent } = useStore()

  const statusColors = {
    completed: 'text-green-400 bg-green-500/10 border-green-500/20',
    running: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    idle: 'text-txt-4 bg-card border-line',
  }
  const iconBgs = {
    completed: 'bg-green-500/10 border-green-500/20',
    running: 'bg-blue-500/10 border-blue-500/20',
    idle: 'bg-card border-line',
  }

  const running = agents.filter(a => a.status === 'running').length
  const completed = agents.filter(a => a.status === 'completed').length

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-txt">Agents</h2>
          <p className="text-xs text-txt-4 mt-1">Monitor, control, and trigger AI agents. Execution happens inside tasks.</p>
        </div>
        <div className="flex items-center gap-3">
          {running > 0 && <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-bold">{running} running</span>}
          {completed > 0 && <span className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-xs font-bold">{completed} completed</span>}
        </div>
      </div>

      {/* Flow diagram */}
      <div className="p-4 rounded-2xl bg-card border border-line">
        <div className="text-[9px] mono font-bold text-txt-5 uppercase tracking-widest mb-3">Agent Interaction Flow</div>
        <div className="flex items-center gap-2 flex-wrap">
          {agents.map((a, i) => (
            <React.Fragment key={a.id}>
              <div className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${statusColors[a.status]}`}>
                {a.icon} {a.name.replace(' Agent', '')}
              </div>
              {i < agents.length - 1 && <span className="text-txt-5 text-sm">→</span>}
            </React.Fragment>
          ))}
          <span className="text-txt-5 text-sm">→</span>
          <div className="px-3 py-2 rounded-xl text-xs font-semibold border bg-purple-500/10 border-purple-500/20 text-purple-400">◈ Decision Engine</div>
        </div>
      </div>

      {/* Agent cards */}
      <div className="grid grid-cols-2 gap-4">
        {agents.map(a => (
          <div key={a.id} className="rounded-2xl border border-line bg-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-line-faint">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border flex-shrink-0 ${iconBgs[a.status]}`}>{a.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-txt">{a.name}</div>
                <div className="text-[10px] text-txt-4 mt-0.5">{a.role}</div>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border mono flex-shrink-0 ${statusColors[a.status]}`}>{a.status}</span>
              <div className="flex gap-1.5 flex-shrink-0">
                {a.status !== 'running' && (
                  <button onClick={() => triggerAgent(a.id)}
                    className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-bold rounded-lg transition-all">
                    ▶ Run
                  </button>
                )}
                {a.status !== 'idle' && (
                  <button onClick={() => resetAgent(a.id)} className="px-2 py-1.5 bg-card hover:bg-card-hover text-txt-3 text-xs rounded-lg transition-all border border-line">↺</button>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-[10px] mb-1.5">
                  <span className="text-txt-4 mono">{a.task}</span>
                  <span className={`font-bold mono ${a.status === 'running' ? 'text-blue-400' : a.status === 'completed' ? 'text-green-400' : 'text-txt-5'}`}>{a.pct}%</span>
                </div>
                <div className="h-1.5 bg-card-hover rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${a.status === 'completed' ? 'bg-green-500' : a.status === 'running' ? 'bg-blue-500 animate-pulse' : 'bg-txt-5'}`} style={{ width: `${a.pct}%` }} />
                </div>
              </div>

              {/* Human/Agent ratio */}
              <div>
                <div className="text-[9px] mono font-bold text-txt-5 uppercase tracking-widest mb-2">Human ↔ Agent Ratio</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-blue-500/8 border border-blue-500/15 text-center">
                    <div className="text-[9px] mono font-bold text-blue-400 mb-1">HUMAN</div>
                    <div className="text-xl font-black mono text-blue-400">{a.humanPct}%</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-green-500/8 border border-green-500/15 text-center">
                    <div className="text-[9px] mono font-bold text-green-400 mb-1">AGENT</div>
                    <div className="text-xl font-black mono text-green-400">{a.agentPct}%</div>
                  </div>
                </div>
              </div>

              {/* Last output */}
              {a.lastOutput && (
                <div>
                  <div className="text-[9px] mono font-bold text-txt-5 uppercase tracking-widest mb-2">Last Output</div>
                  <div className="text-[11px] text-txt-3 leading-relaxed bg-card rounded-lg px-3 py-2 border border-line-faint font-mono">{a.lastOutput}</div>
                </div>
              )}

              {/* Running animation */}
              {a.status === 'running' && (
                <div className="flex items-center gap-2 text-xs text-blue-400">
                  <span className="animate-spin mono">⟳</span>
                  <span>Processing… {a.pct}% complete</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
