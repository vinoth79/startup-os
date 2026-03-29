import React, { useState } from 'react'
import { useStore } from '../store/useStore'

const HIRE_OPTIONS = [
  { key: 'hireCS', role: 'Customer Success Manager', cost: '₹60K/mo', impact: 'D30 churn: 8% → 4%', runway: '22 → 20 mo', riskLevel: 'Low', riskColor: 'text-green-400', note: 'Highest ROI hire right now. Directly fixes retention crisis blocking Series A.' },
  { key: 'hireSales', role: 'Sales Manager', cost: '₹80K/mo', impact: '+30% pipeline', runway: '22 → 19 mo', riskLevel: 'Medium', riskColor: 'text-yellow-400', note: 'Best after playbook is documented. Hire after 30 founder-closed customers.' },
  { key: 'hireEngineer', role: 'Senior Engineer', cost: '₹1.2L/mo', impact: '+40% dev velocity', runway: '22 → 17 mo', riskLevel: 'High', riskColor: 'text-red-400', note: 'Wait until Series A closes. Agent handles 70% of ops — engineering gap smaller than it looks.' },
]

export default function Company() {
  const { startup } = useStore()
  const [tab, setTab] = useState('org')
  const [equity, setEquity] = useState([
    { id: 1, name: 'Founder', pct: 60 },
    { id: 2, name: 'Co-founder', pct: 28 },
    { id: 3, name: 'ESOP Pool', pct: 12 },
  ])
  const [team, setTeam] = useState([
    { id: 1, name: 'Vinoth R.', role: 'CEO / Founder', type: 'Human', tasks: 6 },
    { id: 2, name: 'Co-founder', role: 'CTO', type: 'Human', tasks: 4 },
  ])
  const [newMember, setNewMember] = useState({ name: '', role: '', type: 'Human' })

  const equityTotal = equity.reduce((a, e) => a + parseFloat(e.pct || 0), 0)
  const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#f97316', '#14b8a6']

  return (
    <div className="h-full overflow-hidden flex flex-col">
      {/* Tabs */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-line-faint flex items-center gap-4">
        <h2 className="text-xl font-bold text-txt mr-4">Company</h2>
        {['org', 'hiring', 'equity'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${tab === t ? 'bg-card-hover text-txt' : 'text-txt-3 hover:text-txt-2'}`}>
            {t === 'org' ? '👥 Organisation' : t === 'hiring' ? '💼 Hiring Impact' : '⚖️ Equity'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* ORG TAB */}
        {tab === 'org' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-txt mb-4">Org Chart</h3>
              {/* Tree */}
              <div className="flex flex-col items-center">
                <div className="px-6 py-3 rounded-xl text-center border border-blue-500/30 bg-blue-500/8 min-w-[160px]">
                  <div className="text-xs font-bold text-blue-400">Founder / CEO</div>
                  <div className="text-sm font-semibold text-txt mt-0.5">Vinoth R.</div>
                  <div className="text-[9px] text-txt-4 mt-1 mono">Human</div>
                </div>
                <div className="w-px h-5 bg-line" />
                <div className="flex gap-4 relative">
                  <div className="absolute top-0 left-1/4 right-1/4 h-px bg-line" />
                  {[
                    { role: 'CTO', name: 'Co-founder', type: 'Human', tasks: 4 },
                    { role: 'Agent Cluster', name: '4 AI Agents', type: 'Agent', tasks: 8 },
                  ].map((m, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-px h-5 bg-line" />
                      <div className={`px-5 py-3 rounded-xl text-center border min-w-[140px] ${m.type === 'Agent' ? 'border-green-500/20 bg-green-500/5' : 'border-line bg-card'}`}>
                        <div className={`text-xs font-bold ${m.type === 'Agent' ? 'text-green-400' : 'text-txt-2'}`}>{m.role}</div>
                        <div className="text-sm font-semibold text-txt mt-0.5">{m.name}</div>
                        <div className="text-[9px] mt-1 mono" style={{ color: m.type === 'Agent' ? '#22c55e80' : 'var(--color-text-4)' }}>{m.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-bold text-txt">Org Insights</h3>
                {[
                  { type: 'warn', text: 'Founder handling 6 active tasks — bottleneck risk in 4–6 weeks' },
                  { type: 'warn', text: 'No sales owner — all pipeline is founder-driven' },
                  { type: 'info', text: 'Agents cover 65% of ops tasks — CS and product remain human-only' },
                ].map((ins, i) => (
                  <div key={i} className={`p-3.5 rounded-xl border text-xs leading-relaxed ${ins.type === 'warn' ? 'bg-yellow-500/5 border-yellow-500/15 text-yellow-300' : 'bg-blue-500/5 border-blue-500/15 text-blue-300'}`}>
                    {ins.type === 'warn' ? '⚠ ' : 'ℹ '}{ins.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Add member */}
            <div>
              <h3 className="text-sm font-bold text-txt mb-4">Team Members</h3>
              <div className="space-y-2 mb-5">
                {team.map(m => (
                  <div key={m.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-line">
                    <div className="w-8 h-8 rounded-full bg-card-hover flex items-center justify-center text-xs font-bold text-txt flex-shrink-0">{m.name[0]}</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-txt">{m.name}</div>
                      <div className="text-[10px] text-txt-4">{m.role}</div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${m.type === 'Agent' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>{m.type}</span>
                    {m.tasks > 4 && <span className="text-[9px] text-yellow-400 bg-yellow-500/10 px-1.5 py-0.5 rounded font-bold">⚠ {m.tasks} tasks</span>}
                    <button onClick={() => setTeam(t => t.filter(x => x.id !== m.id))} className="text-txt-5 hover:text-red-400 transition-colors text-xs">✕</button>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-card border border-line space-y-3">
                <div className="text-xs font-bold text-txt-2 mb-2">Add Team Member</div>
                <input value={newMember.name} onChange={e => setNewMember(m => ({ ...m, name: e.target.value }))}
                  placeholder="Name" className="w-full bg-card border border-line rounded-xl px-3 py-2 text-xs text-txt placeholder-txt-5 focus:outline-none focus:border-blue-500/50 transition-colors" />
                <input value={newMember.role} onChange={e => setNewMember(m => ({ ...m, role: e.target.value }))}
                  placeholder="Role (e.g. CTO, VP Sales)" className="w-full bg-card border border-line rounded-xl px-3 py-2 text-xs text-txt placeholder-txt-5 focus:outline-none focus:border-blue-500/50 transition-colors" />
                <div className="flex gap-2">
                  {['Human', 'Agent', 'Advisor'].map(type => (
                    <button key={type} onClick={() => setNewMember(m => ({ ...m, type }))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all border ${newMember.type === type ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'bg-card border-line text-txt-3 hover:border-line-strong'}`}>
                      {type}
                    </button>
                  ))}
                </div>
                <button onClick={() => { if (!newMember.name || !newMember.role) return; setTeam(t => [...t, { ...newMember, id: Date.now(), tasks: 0 }]); setNewMember({ name: '', role: '', type: 'Human' }) }}
                  className="w-full py-2 bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 text-xs font-bold rounded-xl transition-colors border border-blue-500/20">
                  + Add Member
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HIRING TAB */}
        {tab === 'hiring' && (
          <div>
            <p className="text-sm text-txt-3 mb-5">Simulate the cost and runway impact before making any hiring decision.</p>
            <div className="grid grid-cols-3 gap-4">
              {HIRE_OPTIONS.map(h => (
                <div key={h.key} className="p-5 rounded-2xl bg-card border border-line hover:border-line-strong transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-bold text-txt leading-tight">{h.role}</h3>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-card ${h.riskColor}`}>{h.riskLevel} Risk</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {[['Monthly cost', h.cost], ['Impact', h.impact], ['Runway', h.runway]].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs"><span className="text-txt-4">{k}</span><span className="text-txt font-semibold mono">{v}</span></div>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl bg-card border border-line text-xs text-txt-3 leading-relaxed">{h.note}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EQUITY TAB */}
        {tab === 'equity' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-txt mb-4">Equity Split</h3>
              <div className="space-y-4 mb-4">
                {equity.map((e, i) => (
                  <div key={e.id} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: colors[i % colors.length] }} />
                    <span className="text-xs text-txt-2 w-24 truncate">{e.name}</span>
                    <div className="flex-1 h-2 bg-card-hover rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${e.pct}%`, background: colors[i % colors.length] }} />
                    </div>
                    <span className="text-xs mono font-bold text-txt w-10 text-right">{e.pct}%</span>
                  </div>
                ))}
              </div>
              <div className={`text-xs font-bold mono ${Math.abs(equityTotal - 100) < 0.1 ? 'text-green-400' : 'text-yellow-400'}`}>
                Total: {equityTotal}% {equityTotal > 100 ? '⚠ over by ' + (equityTotal - 100).toFixed(1) + '%' : equityTotal < 100 ? '— ' + (100 - equityTotal).toFixed(1) + '% unallocated' : '✓ balanced'}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-txt mb-4">Edit Splits</h3>
              <div className="space-y-3">
                {equity.map((e, i) => (
                  <div key={e.id} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: colors[i % colors.length] }} />
                    <input value={e.name} onChange={ev => setEquity(prev => prev.map(x => x.id === e.id ? { ...x, name: ev.target.value } : x))}
                      className="flex-1 bg-card border border-line rounded-lg px-3 py-1.5 text-xs text-txt focus:outline-none focus:border-blue-500/50" />
                    <input type="number" min="0" max="100" value={e.pct} onChange={ev => setEquity(prev => prev.map(x => x.id === e.id ? { ...x, pct: parseFloat(ev.target.value) || 0 } : x))}
                      className="w-16 bg-card border border-line rounded-lg px-2 py-1.5 text-xs text-txt mono text-right focus:outline-none focus:border-blue-500/50" />
                    <span className="text-xs text-txt-4">%</span>
                    <button onClick={() => setEquity(prev => prev.filter(x => x.id !== e.id))} className="text-txt-5 hover:text-red-400 transition-colors text-xs">✕</button>
                  </div>
                ))}
                <button onClick={() => setEquity(prev => [...prev, { id: Date.now(), name: '', pct: 0 }])}
                  className="w-full py-2 bg-card border border-line rounded-lg text-xs text-txt-3 hover:text-txt-2 hover:bg-card-hover transition-all">
                  + Add row
                </button>
              </div>
              <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/15 rounded-xl text-xs text-blue-300 leading-relaxed">
                💡 Reserve 10–15% ESOP before dilution. 4yr/1yr vesting for all founders. IP assignment in every agreement.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
