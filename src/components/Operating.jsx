import React, { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import TaskRow from './TaskRow'

/* ─── Live decision builder — derives everything from current task state ─── */
function buildLiveDecision(stage, confidence) {
  const tasks = stage.tasks
  const done = (id) => tasks.find(t => t.id === id)?.status === 'done'
  const output = (id) => tasks.find(t => t.id === id)?.output || ''

  if (stage.id === 'pre') {
    const hasProblem = done('pre-1')
    const hasICP = done('pre-2')
    const hasFounderFit = done('pre-3')
    const hasTAM = done('pre-4')
    const hasAgreement = done('pre-5')

    const signals = [
      {
        type: hasProblem ? 'ok' : 'bad',
        text: hasProblem
          ? `Problem defined: "${output('pre-1').slice(0, 80)}${output('pre-1').length > 80 ? '…' : ''}"`
          : 'No problem statement defined yet',
      },
      {
        type: hasICP ? 'ok' : 'bad',
        text: hasICP
          ? `ICP confirmed: ${output('pre-2').slice(0, 70)}${output('pre-2').length > 70 ? '…' : ''}`
          : 'ICP not identified',
      },
      {
        type: hasTAM ? 'ok' : 'bad',
        text: hasTAM
          ? `Market validated: ${output('pre-4').slice(0, 70)}${output('pre-4').length > 70 ? '…' : ''}`
          : 'Market size unknown — trigger Research Agent',
      },
      {
        type: hasFounderFit ? 'ok' : 'warn',
        text: hasFounderFit
          ? `Founder-market fit assessed: ${output('pre-3').slice(0, 60)}${output('pre-3').length > 60 ? '…' : ''}`
          : 'Founder-market fit not yet assessed',
      },
      {
        type: hasAgreement ? 'ok' : 'warn',
        text: hasAgreement
          ? 'Co-founders agreement signed with IP assignment'
          : 'Co-founders agreement not yet signed',
      },
    ]

    const doneCount = [hasProblem, hasICP, hasFounderFit, hasTAM, hasAgreement].filter(Boolean).length

    const rec = doneCount === 0
      ? 'START HERE — define your problem first'
      : doneCount < 3
        ? 'IN PROGRESS — complete remaining tasks'
        : doneCount < 5
          ? 'NEARLY THERE — 1–2 tasks remaining'
          : 'READY — make the Go / No-Go decision'

    const recType = doneCount < 3 ? 'stop' : doneCount < 5 ? 'hold' : 'proceed'

    return {
      badge: doneCount === 0 ? 'START HERE' : doneCount < 5 ? 'IN PROGRESS' : 'DECISION READY',
      question: 'Is this problem worth building a company around?',
      rec,
      recType,
      riskLevel: confidence < 30 ? 'High' : confidence < 60 ? 'Medium' : 'Low',
      signals,
      costImpact: null,
      whatNext: !hasProblem
        ? ['Write a one-sentence problem statement (Task 1)', 'No solution language — describe the pain only']
        : !hasICP
          ? ['Define your ICP (Task 2)', 'Specific enough to name 10 real companies']
          : !hasTAM
            ? ['Trigger Research Agent on Task 4 to validate TAM']
            : !hasFounderFit
              ? ['Complete founder-market fit audit (Task 3)']
              : !hasAgreement
                ? ['Sign co-founders agreement (Task 5)']
                : ['All tasks complete — make the Go/No-Go decision'],
      primaryCTA: doneCount === 0 ? 'Write Problem Statement'
        : !hasTAM && hasProblem && hasICP ? 'Run Research Agent'
        : doneCount < 5 ? 'Continue Stage Tasks'
        : 'Make Go / No-Go Decision',
      targetTaskId: !hasProblem ? 'pre-1'
        : !hasICP ? 'pre-2'
        : !hasTAM ? 'pre-4'
        : !hasFounderFit ? 'pre-3'
        : !hasAgreement ? 'pre-5'
        : null,
    }
  }

  if (stage.id === 'val') {
    const hasHypothesis = done('val-1')
    const hasInterviews = done('val-2')
    const hasAnalysis = done('val-3')
    const hasRetention = done('val-4')
    const hasPreSells = done('val-5')
    const hasPMF = done('val-6')

    const signals = [
      { type: hasHypothesis ? 'ok' : 'bad', text: hasHypothesis ? 'Hypothesis written and testable' : 'No hypothesis defined yet' },
      { type: hasInterviews ? 'ok' : 'bad', text: hasInterviews ? `Interviews complete: ${output('val-2').slice(0, 60)}${output('val-2').length > 60 ? '…' : ''}` : '15 discovery interviews not yet done' },
      { type: hasAnalysis ? 'ok' : 'warn', text: hasAnalysis ? `Validation Agent: ${output('val-3').slice(0, 60)}${output('val-3').length > 60 ? '…' : ''}` : 'Validation Agent analysis pending' },
      { type: hasRetention ? 'ok' : 'warn', text: hasRetention ? 'D7 retention target met' : 'D7 retention at 62% — target 70%+ not met' },
      { type: hasPreSells ? 'ok' : 'bad', text: hasPreSells ? 'Pre-sell commitments collected' : '2 more pre-sell commitments needed' },
    ]

    const doneCount = [hasHypothesis, hasInterviews, hasAnalysis, hasRetention, hasPreSells, hasPMF].filter(Boolean).length
    const recType = doneCount < 3 ? 'stop' : doneCount < 5 ? 'hold' : 'proceed'

    return {
      badge: doneCount < 5 ? 'IN PROGRESS' : 'DECISION POINT',
      question: 'Should you proceed to incorporation this week?',
      rec: doneCount < 3 ? 'NOT YET — complete validation first' : doneCount < 5 ? 'HOLD — fix D7 retention first' : 'PROCEED — all signals met',
      recType,
      riskLevel: recType === 'stop' ? 'High' : recType === 'hold' ? 'Medium' : 'Low',
      signals,
      costImpact: { action: 'Proceeding to incorporation now', items: ['+₹45K legal spend', 'Runway: 22 → 21.4 months', 'Risk: wasted if pivot needed'] },
      whatNext: !hasHypothesis ? ['Write testable hypothesis (Task 1)'] : !hasInterviews ? ['Complete 15 discovery interviews (Task 2)'] : !hasAnalysis ? ['Run Validation Agent (Task 3)'] : !hasRetention ? ['Improve D7 retention to 70%+ (Task 4)'] : !hasPreSells ? ['Collect 2 more pre-sell commitments (Task 5)'] : !hasPMF ? ['Re-run Validation Agent for final PMF score (Task 6)'] : ['Complete all tasks to unlock Incorporation'],
      primaryCTA: !hasHypothesis ? 'Write Hypothesis'
        : !hasInterviews ? 'Log Interviews'
        : !hasAnalysis ? 'Run Validation Agent'
        : !hasRetention ? 'Fix Retention'
        : !hasPreSells ? 'Get Pre-sells'
        : !hasPMF ? 'Run PMF Scorecard'
        : 'Proceed to Incorporation',
      targetTaskId: !hasHypothesis ? 'val-1'
        : !hasInterviews ? 'val-2'
        : !hasAnalysis ? 'val-3'
        : !hasRetention ? 'val-4'
        : !hasPreSells ? 'val-5'
        : !hasPMF ? 'val-6'
        : null,
    }
  }

  // Generic fallback for other stages
  const doneCount = tasks.filter(t => t.status === 'done').length
  return {
    badge: doneCount === 0 ? 'START HERE' : doneCount < tasks.length ? 'IN PROGRESS' : 'COMPLETE',
    question: stage.decision || `Complete ${stage.name}`,
    rec: doneCount < tasks.length ? `${tasks.length - doneCount} tasks remaining` : 'All tasks complete',
    recType: doneCount < tasks.length ? 'hold' : 'proceed',
    riskLevel: confidence < 40 ? 'High' : confidence < 70 ? 'Medium' : 'Low',
    signals: tasks.map(t => ({ type: t.status === 'done' ? 'ok' : 'bad', text: t.status === 'done' ? `${t.title} — complete` : `${t.title} — pending` })),
    costImpact: stage.costImpact || null,
    whatNext: tasks.filter(t => t.status !== 'done').slice(0, 2).map(t => t.title),
    primaryCTA: doneCount === 0 ? 'Start Tasks' : doneCount < tasks.length ? 'Continue Tasks' : 'Complete Stage',
    targetTaskId: tasks.find(t => t.status !== 'done')?.id || null,
  }
}

/* ─── Per-stage KPI config ─── */
const STAGE_KPIS = {
  pre: (startup, active) => {
    const fitMap = { expert: { val: '28', sub: 'Domain expert', color: 'text-green-400', bar: 93, barC: 'bg-green-500' }, some: { val: '18', sub: '3–5 yrs domain', color: 'text-yellow-400', bar: 60, barC: 'bg-yellow-500' }, first: { val: '8', sub: 'First-time', color: 'text-red-400', bar: 27, barC: 'bg-red-500' } }
    const fit = fitMap[startup.founderExp] || fitMap.first
    const tamDone = active.tasks.find(t => t.id === 'pre-4')?.status === 'done'
    const cofoDone = active.tasks.find(t => t.id === 'pre-5')?.status === 'done'
    const done = active.tasks.filter(t => t.status === 'done').length
    const pct = Math.round((done / active.tasks.length) * 100)
    return [
      { label: 'Founder Fit', val: fit.val, unit: '/30', sub: fit.sub, color: fit.color, bar: fit.bar, barC: fit.barC },
      { label: 'Market Size', val: tamDone ? '✓' : '—', unit: '', sub: tamDone ? 'TAM validated' : 'Run Research Agent', color: tamDone ? 'text-green-400' : 'text-red-400', bar: tamDone ? 100 : 0, barC: tamDone ? 'bg-green-500' : 'bg-red-500' },
      { label: 'Co-founder Agmt', val: cofoDone ? '✓' : '—', unit: '', sub: cofoDone ? 'Signed' : 'Not signed', color: cofoDone ? 'text-green-400' : 'text-red-400', bar: cofoDone ? 100 : 0, barC: cofoDone ? 'bg-green-500' : 'bg-red-500' },
      { label: 'Stage Progress', val: `${pct}`, unit: '%', sub: `${done}/${active.tasks.length} tasks`, color: pct >= 80 ? 'text-green-400' : pct >= 40 ? 'text-yellow-400' : 'text-red-400', bar: pct, barC: pct >= 80 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500' },
    ]
  },
  val: (startup, active) => {
    const pmfDone = active.tasks.find(t => t.id === 'val-3')?.status === 'done'
    const retDone = active.tasks.find(t => t.id === 'val-4')?.status === 'done'
    const done = active.tasks.filter(t => t.status === 'done').length
    const pct = Math.round((done / active.tasks.length) * 100)
    return [
      { label: 'PMF Score', val: pmfDone ? '7.8' : '—', unit: pmfDone ? '/10' : '', sub: pmfDone ? 'Sprint #1' : 'Run Validation Agent', color: pmfDone ? 'text-green-400' : 'text-red-400', bar: pmfDone ? 78 : 0, barC: pmfDone ? 'bg-green-500' : 'bg-red-500' },
      { label: 'CVR', val: pmfDone ? '24' : '—', unit: pmfDone ? '%' : '', sub: pmfDone ? 'Landing page' : 'Pending', color: pmfDone ? 'text-green-400' : 'text-txt-5', bar: pmfDone ? 24 : 0, barC: 'bg-green-500' },
      { label: 'D7 Retention', val: retDone ? '70+' : '62', unit: '%', sub: retDone ? 'Target met' : '⚠ below 70%', color: retDone ? 'text-green-400' : 'text-yellow-400', bar: retDone ? 72 : 62, barC: retDone ? 'bg-green-500' : 'bg-yellow-500' },
      { label: 'Stage Progress', val: `${pct}`, unit: '%', sub: `${done}/${active.tasks.length} tasks`, color: pct >= 80 ? 'text-green-400' : pct >= 40 ? 'text-yellow-400' : 'text-red-400', bar: pct, barC: pct >= 80 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500' },
    ]
  },
}

// Default KPI generator for stages without a custom one
function defaultKpis(startup, active) {
  const done = active.tasks.filter(t => t.status === 'done').length
  const total = active.tasks.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const scored = active.tasks.filter(t => t.score != null)
  const avg = scored.length > 0 ? (scored.reduce((a, t) => a + t.score, 0) / scored.length).toFixed(1) : '—'
  const agentTasks = active.tasks.filter(t => t.owner === 'Agent')
  const agentDone = agentTasks.filter(t => t.status === 'done').length
  return [
    { label: 'Stage Progress', val: `${pct}`, unit: '%', sub: `${done}/${total} tasks`, color: pct >= 80 ? 'text-green-400' : pct >= 40 ? 'text-yellow-400' : 'text-red-400', bar: pct, barC: pct >= 80 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500' },
    { label: 'Avg Score', val: avg, unit: avg !== '—' ? '/10' : '', sub: scored.length > 0 ? `${scored.length} scored` : 'No scores yet', color: parseFloat(avg) >= 7 ? 'text-green-400' : parseFloat(avg) >= 5 ? 'text-yellow-400' : 'text-txt-5', bar: parseFloat(avg) > 0 ? parseFloat(avg) * 10 : 0, barC: parseFloat(avg) >= 7 ? 'bg-green-500' : 'bg-yellow-500' },
    { label: 'Agent Tasks', val: `${agentDone}`, unit: `/${agentTasks.length}`, sub: agentTasks.length > 0 ? 'AI-assisted' : 'None', color: agentDone === agentTasks.length && agentTasks.length > 0 ? 'text-green-400' : 'text-blue-400', bar: agentTasks.length > 0 ? Math.round((agentDone / agentTasks.length) * 100) : 0, barC: 'bg-blue-500' },
    { label: 'Human Tasks', val: `${done - agentDone}`, unit: `/${total - agentTasks.length}`, sub: 'Founder-driven', color: 'text-purple-400', bar: (total - agentTasks.length) > 0 ? Math.round(((done - agentDone) / (total - agentTasks.length)) * 100) : 0, barC: 'bg-purple-500' },
  ]
}

export default function Operating() {
  const { stages, agents, startup, getConfidence, addSignal, runTaskAgent, taskAgentStates } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [expandedTaskId, setExpandedTaskId] = useState(null)

  const active = stages.find(s => s.status === 'active') || stages[0]
  const conf = getConfidence()

  // Auto-trigger agent when an agent task is force-expanded
  useEffect(() => {
    if (!expandedTaskId) return
    const task = active?.tasks.find(t => t.id === expandedTaskId)
    if (!task || task.owner !== 'Agent' || task.status === 'done') return
    const currentState = taskAgentStates[expandedTaskId]
    if (!currentState || currentState === 'idle') {
      const timer = setTimeout(() => {
        runTaskAgent(active.id, expandedTaskId)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [expandedTaskId])

  // Live decision — fully derived from current task state
  const decision = buildLiveDecision(active, conf)

  const recColors = {
    proceed: { chip: 'text-green-400 bg-green-500/10 border-green-500/20', text: 'text-green-400' },
    hold: { chip: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-400' },
    stop: { chip: 'text-red-400 bg-red-500/10 border-red-500/20', text: 'text-red-400' },
  }
  const rc = recColors[decision.recType] || recColors.hold
  const confBar = conf >= 80 ? 'bg-green-500' : conf >= 50 ? 'bg-yellow-500' : 'bg-red-500'

  const sigIcons = { ok: '✅', warn: '⚠️', bad: '❌' }
  const sigColors = { ok: 'text-green-400 bg-green-500/5 border-green-500/15', warn: 'text-yellow-400 bg-yellow-500/5 border-yellow-500/15', bad: 'text-red-400 bg-red-500/5 border-red-500/15' }

  const tasksDone = active.tasks.filter(t => t.status === 'done').length
  const avgScore = (() => { const s = active.tasks.filter(t => t.score != null); return s.length > 0 ? (s.reduce((a, t) => a + t.score, 0) / s.length).toFixed(1) : null })()

  // KPIs — stage-specific or default
  const kpiBuilder = STAGE_KPIS[active.id]
  const kpis = kpiBuilder ? kpiBuilder(startup, active) : defaultKpis(startup, active)

  // Live agents from store
  const activeAgents = agents.filter(a => a.status === 'running' || a.status === 'idle').slice(0, 3)
  const agentPills = activeAgents.length > 0 ? activeAgents : agents.slice(0, 3)

  return (
    <div className="h-full overflow-hidden flex flex-col">
      {/* Stage strip */}
      <div className="flex-shrink-0 px-6 py-2.5 border-b border-line-faint bg-card flex items-center gap-4 overflow-x-auto">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs font-bold text-txt">Stage {active.num}: {active.name}</span>
        </div>
        <div className="flex-1 max-w-40 h-1.5 bg-card-hover rounded-full overflow-hidden flex-shrink-0">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${active.pct}%` }} />
        </div>
        <span className="text-xs mono text-txt-4 flex-shrink-0">{active.pct}%</span>
        <span className="text-xs text-txt-5 flex-shrink-0 ml-auto">🔒 Future stages locked</span>
        <div className="flex gap-1 ml-2 flex-shrink-0">
          {stages.map(s => (
            <div key={s.id}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-medium border mono
                ${s.status === 'completed' ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : s.status === 'active' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                : 'bg-card border-line text-txt-5'}`}>
              {s.short}
            </div>
          ))}
        </div>
      </div>

      {/* Full-width center pane */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Decision block */}
        <div className="rounded-2xl overflow-hidden border border-yellow-500/15 bg-gradient-to-br from-yellow-500/5 to-transparent">
          {/* Top */}
          <div className="p-6 border-b border-line-faint">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[9px] mono font-bold text-txt-4 uppercase tracking-widest">Stage {active.num} · Decision</span>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${rc.chip}`}>{decision.badge}</span>
            </div>
            <h1 className="decision-question text-txt mb-2">{decision.question}</h1>
            <div className={`text-sm font-bold mb-4 ${rc.text}`}>{decision.rec}</div>
            <div className="flex items-center gap-5">
              <div>
                <div className="text-[9px] mono font-bold text-txt-4 uppercase tracking-widest mb-1">Confidence</div>
                <div className="text-3xl font-black mono text-txt leading-none transition-all duration-700">{conf}<span className="text-sm text-txt-4 font-normal">%</span></div>
                <div className="w-28 h-1.5 bg-card-hover rounded-full overflow-hidden mt-1.5">
                  <div className={`h-full rounded-full transition-all duration-700 ${confBar}`} style={{ width: `${conf}%` }} />
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${rc.chip}`}>
                {decision.riskLevel} Risk
              </div>
            </div>
            {/* Cost impact */}
            {decision.costImpact && (
              <div className="mt-4 flex items-start gap-3 px-4 py-3 bg-red-500/5 border border-red-500/15 rounded-xl flex-wrap">
                <span className="text-[9px] mono font-bold text-red-400 uppercase tracking-wide flex-shrink-0 mt-0.5">Cost Impact if:</span>
                <span className="text-xs text-txt-3 font-medium">{decision.costImpact.action}</span>
                <div className="flex gap-3 w-full mt-1 flex-wrap">
                  {decision.costImpact.items.map((item, i) => (
                    <span key={i} className="text-xs text-txt-3 bg-card px-2 py-1 rounded-lg">{item}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Signals */}
          {decision.signals?.length > 0 && (
            <div className="px-6 py-4 border-b border-line-faint">
              <div className="text-[9px] mono font-bold text-txt-4 uppercase tracking-widest mb-3">Key signals</div>
              <div className="space-y-2">
                {decision.signals.map((sig, i) => (
                  <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-xs ${sigColors[sig.type]}`}>
                    <span className="text-sm flex-shrink-0">{sigIcons[sig.type]}</span>
                    <span className="text-txt-2">{sig.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What next hint */}
          {decision.whatNext?.length > 0 && (
            <div className="px-6 py-3 border-b border-line-faint">
              <div className="text-[9px] mono font-bold text-txt-4 uppercase tracking-widest mb-2">Next steps</div>
              <div className="space-y-1">
                {decision.whatNext.map((step, i) => (
                  <div key={i} className="text-xs text-txt-3 flex items-center gap-2">
                    <span className="text-blue-400">→</span> {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="px-6 py-4 flex items-center gap-3 flex-wrap">
            <button onClick={() => {
              const targetId = decision.targetTaskId
              const targetTask = targetId ? active.tasks.find(t => t.id === targetId) : null
              if (!targetTask || targetTask.status === 'done') {
                // Fallback: find any incomplete task, or open modal
                const anyIncomplete = active.tasks.find(t => t.status !== 'done')
                if (!anyIncomplete) { setShowModal(true); return }
                setExpandedTaskId(anyIncomplete.id)
                setTimeout(() => {
                  const el = document.getElementById(`task-${anyIncomplete.id}`)
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }, 50)
                if (anyIncomplete.owner !== 'Agent') {
                  setTimeout(() => {
                    const el = document.getElementById(`task-${anyIncomplete.id}`)
                    const ta = el?.querySelector('textarea')
                    if (ta) ta.focus()
                  }, 500)
                }
                return
              }
              setExpandedTaskId(targetTask.id)
              setTimeout(() => {
                const el = document.getElementById(`task-${targetTask.id}`)
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }, 50)
              if (targetTask.owner !== 'Agent') {
                setTimeout(() => {
                  const el = document.getElementById(`task-${targetTask.id}`)
                  const ta = el?.querySelector('textarea')
                  if (ta) ta.focus()
                }, 500)
              }
            }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
              ▶ {decision.primaryCTA}
            </button>
            <button onClick={() => addSignal('Decision deferred', 'task', -1)} className="px-4 py-3 border border-line text-txt-3 text-sm font-medium rounded-xl hover:bg-card hover:text-txt-2 transition-all">
              Defer decision
            </button>
            <button onClick={() => setShowModal(true)} className="px-4 py-3 text-txt-4 text-sm transition-all hover:text-txt-2 ml-auto">
              All options →
            </button>
          </div>
        </div>

        {/* Health KPIs — dynamic horizontal row */}
        <div className="flex gap-3">
          {kpis.map(h => (
            <div key={h.label} className="flex-1 p-3.5 rounded-xl bg-card border border-line">
              <div className="kpi-label text-txt-3 mb-1">{h.label}</div>
              <div className={`text-xl font-black mono leading-tight ${h.color}`}>{h.val}<span className="text-[10px] text-txt-5 font-normal">{h.unit}</span></div>
              <div className="text-[9px] text-txt-5 mt-0.5">{h.sub}</div>
              <div className="h-1 bg-card-hover rounded-full overflow-hidden mt-2">
                <div className={`h-full rounded-full transition-all duration-700 ${h.barC}`} style={{ width: `${h.bar}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Active agents — live from store */}
        <div className="flex gap-2.5">
          {agentPills.map(a => (
            <div key={a.id} className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-card border border-line">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${a.status === 'running' ? 'bg-blue-400 animate-pulse' : a.status === 'completed' ? 'bg-green-400' : 'bg-txt-5'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-txt truncate">{a.name}</div>
                <div className="text-[9px] text-txt-4 mono truncate">{a.task}</div>
              </div>
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded mono flex-shrink-0 ${a.status === 'running' ? 'bg-blue-500/15 text-blue-400' : a.status === 'completed' ? 'bg-green-500/15 text-green-400' : 'bg-card-hover text-txt-5'}`}>
                {a.status === 'running' ? 'Run' : a.status === 'completed' ? 'Done' : 'Idle'}
              </span>
            </div>
          ))}
        </div>

        {/* Tasks */}
        <div className="rounded-2xl border border-line bg-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-line-faint flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-txt">Stage Tasks</h3>
              <p className="text-xs text-txt-4 mt-0.5">{tasksDone}/{active.tasks.length} complete{avgScore ? ` · avg ${avgScore}/10` : ''}</p>
            </div>
            {avgScore && parseFloat(avgScore) < 7 && (
              <div className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <span className="text-[10px] text-yellow-400 font-bold">Need avg 7.0+ to complete</span>
              </div>
            )}
          </div>
          {active.tasks.map(task => (
            <TaskRow key={task.id} task={task} stageId={active.id} stageStatus={active.status} forceExpanded={expandedTaskId === task.id} />
          ))}
        </div>
      </div>

      {/* Decision modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-elevated border border-line-strong rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-txt">{decision.question}</h3>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-txt-4 hover:text-txt hover:bg-card-hover transition-all text-sm">✕</button>
            </div>
            <div className="space-y-2">
              {[
                { label: decision.recType === 'proceed' ? 'Proceed as recommended' : 'Take the recommended action', desc: decision.rec, primary: true },
                { label: 'Defer — need more data', desc: 'Wait for additional signals before deciding.', primary: false },
                { label: 'Escalate to advisor', desc: 'Get an expert second opinion before committing.', primary: false },
              ].map((opt, i) => (
                <div key={i} onClick={() => { addSignal(`Decision: ${opt.label}`, 'milestone', i === 0 ? 3 : -1); setShowModal(false) }}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${opt.primary ? 'bg-blue-500/10 border-blue-500/25 hover:bg-blue-500/15' : 'bg-card border-line hover:bg-card-hover'}`}>
                  <div className="text-sm font-bold text-txt mb-1">{opt.label}</div>
                  <div className="text-xs text-txt-3 leading-relaxed">{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
