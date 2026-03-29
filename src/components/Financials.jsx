import React from 'react'
import { useStore } from '../store/useStore'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const SCENARIOS = [
  { key: 'hireCS', label: '+ CS Manager', addBurn: 0.6, desc: 'Fixes churn, NRR crosses 100%', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  { key: 'hireSales', label: '+ Sales Manager', addBurn: 0.8, desc: '+30% pipeline coverage', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  { key: 'hireEngineer', label: '+ Engineer', addBurn: 1.2, desc: '+40% dev velocity', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  { key: 'spendAds', label: '+ Ads Budget', addBurn: 0.5, desc: '2× lead volume', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-elevated border border-line-strong rounded-xl p-3 shadow-xl">
      <p className="text-[10px] text-txt-3 mb-1.5 mono">{label}</p>
      {payload.map(e => (
        <div key={e.name} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: e.color }} />
          <span className="text-txt-2 capitalize">{e.name}</span>
          <span className="mono text-txt ml-1">₹{e.value}L</span>
        </div>
      ))}
    </div>
  )
}

export default function Financials() {
  const { financials, toggleScenario, updateFinancials } = useStore()

  const activeScenarios = SCENARIOS.filter(s => financials.scenarios[s.key])
  const addedBurn = activeScenarios.reduce((a, s) => a + s.addBurn, 0)
  const totalBurn = financials.monthlyBurn + addedBurn
  const runway = totalBurn > 0 ? Math.floor(financials.cashInBank / totalBurn) : 99
  const burnMultiple = financials.revenue > 0 ? (totalBurn / financials.revenue).toFixed(1) : '∞'
  const runwayColor = runway < 6 ? 'text-red-400' : runway < 12 ? 'text-yellow-400' : 'text-green-400'
  const runwayBarColor = runway < 6 ? 'bg-red-500' : runway < 12 ? 'bg-yellow-500' : 'bg-green-500'

  const metrics = [
    { label: 'Monthly Burn', val: `₹${totalBurn.toFixed(1)}L`, sub: addedBurn > 0 ? `+₹${addedBurn.toFixed(1)}L from scenarios` : 'Current', color: 'text-red-400', barPct: Math.min((totalBurn / 10) * 100, 100), barColor: 'bg-red-500' },
    { label: 'Revenue', val: `₹${financials.revenue}L`, sub: '↑ 18% MoM', color: 'text-green-400', barPct: Math.min((financials.revenue / 5) * 100, 100), barColor: 'bg-green-500' },
    { label: 'Runway', val: `${runway}mo`, sub: runway < 12 ? '⚠ Start fundraising' : 'Comfortable', color: runwayColor, barPct: Math.min((runway / 24) * 100, 100), barColor: runwayBarColor },
    { label: 'Burn Multiple', val: `${burnMultiple}×`, sub: parseFloat(burnMultiple) <= 2 ? 'Efficient' : parseFloat(burnMultiple) <= 5 ? 'Watch' : 'Reduce burn', color: parseFloat(burnMultiple) <= 2 ? 'text-green-400' : parseFloat(burnMultiple) <= 5 ? 'text-yellow-400' : 'text-red-400', barPct: Math.min((parseFloat(burnMultiple) / 10) * 100, 100), barColor: 'bg-purple-500' },
    { label: 'Cash in Bank', val: `₹${financials.cashInBank}L`, sub: 'Total reserves', color: 'text-blue-400', barPct: Math.min((financials.cashInBank / 100) * 100, 100), barColor: 'bg-blue-500' },
    { label: 'NRR', val: '94%', sub: 'Target 100%+', color: 'text-yellow-400', barPct: 94, barColor: 'bg-yellow-500' },
  ]

  // Build chart with scenario overlay
  const chartData = financials.history.map((m, i) => ({
    ...m,
    projected: i === financials.history.length - 1 ? totalBurn : undefined,
  }))

  return (
    <div className="h-full overflow-hidden grid grid-cols-[280px_1fr]">
      {/* Inputs */}
      <div className="border-r border-line-faint overflow-y-auto p-5 bg-panel space-y-5">
        <div>
          <h3 className="text-sm font-bold text-txt mb-4">Current Financials</h3>
          {[
            { key: 'monthlyBurn', label: 'Monthly Burn (₹L)', value: financials.monthlyBurn },
            { key: 'revenue', label: 'Monthly Revenue (₹L)', value: financials.revenue },
            { key: 'cashInBank', label: 'Cash in Bank (₹L)', value: financials.cashInBank },
          ].map(f => (
            <div key={f.key} className="mb-3">
              <label className="text-[9px] mono font-bold text-txt-4 uppercase tracking-widest block mb-1.5">{f.label}</label>
              <input type="number" step="0.1" defaultValue={f.value}
                onBlur={e => updateFinancials({ [f.key]: parseFloat(e.target.value) || 0 })}
                className="w-full bg-card border border-line rounded-xl px-3 py-2.5 text-sm text-txt mono focus:outline-none focus:border-blue-500/50 transition-colors" />
            </div>
          ))}
        </div>

        {/* Scenario toggles */}
        <div>
          <h3 className="text-sm font-bold text-txt mb-1">Scenario Simulator</h3>
          <p className="text-xs text-txt-4 mb-3 leading-relaxed">Toggle scenarios to see live impact on burn and runway.</p>
          <div className="space-y-2">
            {SCENARIOS.map(s => {
              const active = financials.scenarios[s.key]
              return (
                <button key={s.key} onClick={() => toggleScenario(s.key)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${active ? `${s.color} border-current` : 'bg-card border-line hover:bg-card-hover'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${active ? '' : 'text-txt-2'}`}>{s.label}</span>
                    <div className={`w-8 h-4 rounded-full transition-all flex items-center px-0.5 ${active ? 'bg-blue-500' : 'bg-card-hover'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-all ${active ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-txt-4">{s.desc}</span>
                    <span className={`mono font-bold ${active ? 'text-red-400' : 'text-txt-5'}`}>+₹{s.addBurn}L/mo</span>
                  </div>
                </button>
              )
            })}
          </div>
          {addedBurn > 0 && (
            <div className="mt-3 p-3 rounded-xl bg-red-500/8 border border-red-500/15">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-txt-3">Total new burn</span>
                <span className="text-red-400 font-bold mono">+₹{addedBurn.toFixed(1)}L/mo</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-txt-3">Runway impact</span>
                <span className={`font-bold mono ${runwayColor}`}>{Math.floor(financials.cashInBank / financials.monthlyBurn)} → {runway} months</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-txt">Financials</h2>
            <p className="text-xs text-txt-4 mt-1">Decision engine — model impact before spending</p>
          </div>
          {runway < 12 && (
            <div className="px-4 py-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <span className="text-xs font-bold text-yellow-400">⚠ Start Series A process within {runway < 6 ? '30' : '60'} days</span>
            </div>
          )}
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-3 gap-3">
          {metrics.map(m => (
            <div key={m.label} className="p-4 rounded-2xl bg-card border border-line">
              <div className="text-[9px] text-txt-4 mb-1.5">{m.label}</div>
              <div className={`text-2xl font-black mono leading-none ${m.color}`}>{m.val}</div>
              <div className="text-[9px] text-txt-5 mt-1">{m.sub}</div>
              <div className="h-1.5 bg-card-hover rounded-full overflow-hidden mt-2">
                <div className={`h-full rounded-full transition-all duration-700 ${m.barColor}`} style={{ width: `${m.barPct}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="p-5 rounded-2xl bg-card border border-line">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-txt">Revenue vs Burn</h3>
            <div className="flex gap-4">
              {[['#ef4444', 'Burn'], ['#22c55e', 'Revenue']].map(([c, l]) => (
                <div key={l} className="flex items-center gap-1.5 text-[10px] text-txt-4">
                  <div className="w-3 h-0.5 rounded" style={{ background: c }} />{l}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="burnG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-faint)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--color-text-5)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-text-5)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="burn" stroke="#ef4444" fill="url(#burnG)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#revG)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Scenario comparison */}
        {activeScenarios.length > 0 && (
          <div className="p-5 rounded-2xl bg-card border border-line">
            <h3 className="text-sm font-bold text-txt mb-3">Scenario Impact</h3>
            <div className="grid grid-cols-3 gap-3">
              {[{ name: 'Baseline', burn: financials.monthlyBurn, extra: 0 }, ...activeScenarios.map(s => ({ name: s.label, burn: financials.monthlyBurn + s.addBurn, extra: s.addBurn }))].map((sc, i) => {
                const r = sc.burn > 0 ? Math.floor(financials.cashInBank / sc.burn) : 99
                const rc = r < 6 ? 'text-red-400' : r < 12 ? 'text-yellow-400' : 'text-green-400'
                return (
                  <div key={i} className={`p-4 rounded-xl bg-card border ${i === 0 ? 'border-line' : 'border-line-strong'}`}>
                    <div className="text-xs font-bold text-txt mb-3">{sc.name}</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-txt-4">Burn</span><span className="mono text-txt font-bold">₹{sc.burn.toFixed(1)}L</span></div>
                      <div className="flex justify-between"><span className="text-txt-4">Runway</span><span className={`mono font-bold ${rc}`}>{r}mo</span></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
