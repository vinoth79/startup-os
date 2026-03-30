import React from 'react'
import { useStore } from '../store/useStore'

/* ─── Live decision builder (shared with Operating) ─── */
function buildLiveSignals(stage) {
  const done = (id) => stage.tasks.find(t => t.id === id)?.status === 'done'
  if (stage.id === 'pre') {
    return [
      { type: done('pre-1') ? 'ok' : 'bad', text: done('pre-1') ? 'Problem statement defined' : 'No problem statement defined yet' },
      { type: done('pre-2') ? 'ok' : 'bad', text: done('pre-2') ? 'ICP identified' : 'ICP not identified' },
      { type: done('pre-4') ? 'ok' : 'bad', text: done('pre-4') ? 'TAM validated via Research Agent' : 'Market size unknown' },
      { type: done('pre-3') ? 'ok' : 'warn', text: done('pre-3') ? 'Founder-market fit assessed' : 'Founder fit not yet assessed' },
      { type: done('pre-5') ? 'ok' : 'warn', text: done('pre-5') ? 'Co-founders agreement signed' : 'Agreement not yet signed' },
    ]
  }
  if (stage.id === 'val') {
    return [
      { type: done('val-1') ? 'ok' : 'bad', text: done('val-1') ? 'Hypothesis written' : 'No hypothesis defined' },
      { type: done('val-2') ? 'ok' : 'bad', text: done('val-2') ? 'Discovery interviews done' : 'Interviews not yet done' },
      { type: done('val-3') ? 'ok' : 'warn', text: done('val-3') ? 'Validation Agent analysis done' : 'Validation analysis pending' },
      { type: done('val-4') ? 'ok' : 'warn', text: done('val-4') ? 'D7 retention target met' : 'D7 retention below target' },
      { type: done('val-5') ? 'ok' : 'bad', text: done('val-5') ? 'Pre-sell commitments collected' : 'Pre-sells needed' },
    ]
  }
  return stage.tasks.map(t => ({ type: t.status === 'done' ? 'ok' : 'bad', text: t.status === 'done' ? `${t.title} — done` : `${t.title} — pending` }))
}

/* ─── Stage metrics ─── */
function getStageMetrics(stage, tasks) {
  if (stage.id === 'pre') {
    const founderTask = tasks.find(t => t.id === 'pre-3')
    const tamTask = tasks.find(t => t.id === 'pre-4')
    const done = tasks.filter(t => t.status === 'done').length
    return [
      { label: 'Founder fit', value: founderTask?.score ? `${founderTask.score}/10` : '—', color: founderTask?.score >= 7 ? 'text-green-600' : 'text-gray-400' },
      { label: 'TAM', value: tamTask?.status === 'done' ? '✓ Validated' : '—', color: tamTask?.status === 'done' ? 'text-gray-900' : 'text-gray-300' },
      { label: 'Progress', value: `${Math.round((done / tasks.length) * 100)}%`, color: 'text-blue-600' },
      { label: 'Tasks done', value: `${done}/${tasks.length}`, color: 'text-gray-600' },
    ]
  }
  if (stage.id === 'val') {
    const pmfDone = tasks.find(t => t.id === 'val-3')?.status === 'done'
    const retDone = tasks.find(t => t.id === 'val-4')?.status === 'done'
    const done = tasks.filter(t => t.status === 'done').length
    return [
      { label: 'PMF Score', value: pmfDone ? '7.8/10' : '—', color: pmfDone ? 'text-green-600' : 'text-gray-400' },
      { label: 'CVR', value: pmfDone ? '24%' : '—', color: pmfDone ? 'text-green-600' : 'text-gray-400' },
      { label: 'D7 Retention', value: retDone ? '70%+' : '62%', color: retDone ? 'text-green-600' : 'text-orange-500' },
      { label: 'Tasks done', value: `${done}/${tasks.length}`, color: 'text-gray-600' },
    ]
  }
  const done = tasks.filter(t => t.status === 'done').length
  return [
    { label: 'Progress', value: `${tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0}%`, color: 'text-blue-600' },
    { label: 'Tasks done', value: `${done}/${tasks.length}`, color: 'text-gray-600' },
  ]
}

export default function SignalsFeed() {
  const { signals, stages, getConfidence } = useStore()

  const conf = getConfidence()
  const active = stages.find(s => s.status === 'active') || stages[0]
  const done = active?.tasks.filter(t => t.status === 'done').length || 0
  const total = active?.tasks.length || 1

  const liveSignals = buildLiveSignals(active)
  const stageMetrics = getStageMetrics(active, active.tasks)

  return (
    <aside className="w-72 flex-shrink-0 h-full flex flex-col border-l border-gray-200 bg-white">

      {/* ─── Section 1: Confidence Score ─── */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Confidence Score</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            conf >= 80 ? 'bg-green-100 text-green-700' :
            conf >= 50 ? 'bg-orange-100 text-orange-600' :
            'bg-red-100 text-red-600'
          }`}>
            {conf >= 80 ? 'Low risk' : conf >= 50 ? 'Medium risk' : 'High risk'}
          </span>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-4xl font-black text-gray-900 mono">{conf}</span>
          <span className="text-gray-400 text-base mb-1">/ 100</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${
            conf >= 80 ? 'bg-green-500' : conf >= 50 ? 'bg-orange-400' : 'bg-red-500'
          }`} style={{ width: `${conf}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1.5">
          <span>{done} of {total} tasks done</span>
          <span>{active.pct || 0}%</span>
        </div>
      </div>

      {/* ─── Section 2: Stage Signals (live checklist) ─── */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Stage Signals</div>
        <div className="space-y-2">
          {liveSignals.map((sig, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                sig.type === 'ok' ? 'bg-green-500' :
                sig.type === 'warn' ? 'bg-orange-400' :
                'bg-gray-200'
              }`} />
              <span className={`text-xs leading-relaxed ${
                sig.type === 'ok' ? 'text-gray-700' : 'text-gray-400'
              }`}>{sig.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Section 3: Stage Metrics ─── */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Stage Metrics</div>
        <div className="grid grid-cols-2 gap-3">
          {stageMetrics.map(m => (
            <div key={m.label}>
              <div className={`text-lg font-black mono ${m.color || 'text-gray-900'}`}>{m.value}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Section 4: Recent Activity ─── */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Recent Activity</div>
        <div className="space-y-4">
          {signals.length === 0 ? (
            <p className="text-xs text-gray-400 leading-relaxed">
              Activity appears here as you complete tasks and run agents.
            </p>
          ) : (
            signals.slice(0, 20).map(sig => (
              <div key={sig.id} className="flex gap-2.5">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  sig.type === 'task' ? 'bg-green-500' :
                  sig.type === 'agent' ? 'bg-blue-500' :
                  sig.type === 'milestone' ? 'bg-purple-500' :
                  'bg-gray-300'
                }`} />
                <div>
                  <p className="text-xs font-semibold text-gray-700 leading-relaxed">{sig.text}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{sig.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  )
}
