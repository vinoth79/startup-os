import React, { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'

const PLACEHOLDERS = {
  'pre-1': 'e.g. "CA firms with 5–25 staff waste 8–12 hrs/week manually reconciling GST mismatches. Costs each firm ~₹28K/year in unbillable time."',
  'pre-2': 'e.g. "Chartered Accountants running their own practice, 5–25 employees, managing 30+ GST clients. Reachable via ICAI chapter networks."',
  'pre-3': 'e.g. "6 years in fintech domain. Direct access to 12 CA firm partners. Previously built and sold a reconciliation tool used by 200+ firms."',
  'pre-5': 'e.g. "60/40 equity split. 4yr vesting with 1yr cliff. IP assignment clause included. Signed via DocuSign on [date]."',
  'val-1': 'e.g. "I believe CA firms with 5–25 staff struggle with GST reconciliation errors so badly they will pay ₹2,000/month for automated reconciliation."',
  'val-2': 'e.g. "15 interviews completed. 11/15 confirmed pain unprompted before product was mentioned. 3 verbatim quotes captured."',
  'val-4': 'e.g. "Improved onboarding flow reduced drop-off by 40%. D7 retention now at 73%, above 70% target."',
  'val-5': 'e.g. "2 additional pre-sell commitments: Firm A (₹2K/mo), Firm B (₹2K/mo). Both signed LOIs."',
}

const THINKING_STEPS = {
  'pre-4': ['Scanning 47 competitor websites…', 'Running bottom-up TAM model…', 'Cross-checking 3 industry comparables…'],
  'val-3': ['Synthesising 15 interview transcripts…', 'Scoring PMF signals…', 'Calculating CVR and retention metrics…'],
  'val-6': ['Loading updated retention data…', 'Recalculating PMF score…', 'Generating final recommendation…'],
  'inc-2': ['Searching MCA registry…', 'Checking trademark database…', 'Generating name options…'],
  'inc-4': ['Preparing SPICe+ Part B…', 'Pre-filling DIN, PAN, TAN fields…', 'Generating submission package…'],
  'inc-6': ['Drafting INC-20A…', 'Setting filing reminders…', 'Calculating penalty windows…'],
  'setup-2': ['Preparing GSTIN application…', 'Setting monthly return reminders…', 'Calculating first return deadline…'],
  'setup-3': ['Identifying trademark classes…', 'Submitting TM application…', 'Estimating registration timeline…'],
  'ops-4': ['Analysing LinkedIn CAC data…', 'Calculating LTV:CAC ratio…', 'Benchmarking channel efficiency…'],
}

export default function TaskRow({ task, stageId, stageStatus, forceExpanded }) {
  const { completeTask, setTaskOutput, evaluateTask, runTaskAgent, acceptAgentOutput, dismissAgentOutput, taskAgentStates, taskAgentOutputs } = useStore()
  const [expanded, setExpanded] = useState(false)
  const [localOut, setLocalOut] = useState(task.output || '')
  const [evalResult, setEvalResult] = useState(task.feedback || null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [evaluating, setEvaluating] = useState(false)

  useEffect(() => {
    if (forceExpanded) {
      setExpanded(true)
    }
  }, [forceExpanded])

  const canAct = stageStatus === 'active' || stageStatus === 'completed'
  const agentState = taskAgentStates[task.id]
  const agentOut = taskAgentOutputs[task.id]
  const isAgent = task.owner === 'Agent'

  const scoreColor = s => s >= 8 ? 'text-green-400 bg-green-500/10 border-green-500/20' : s >= 6 ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'
  const priorityBg = { Critical: 'text-red-400 bg-red-500/10', Important: 'text-yellow-400 bg-yellow-500/10', Optional: 'text-txt-4 bg-card' }
  const statusBg = { done: 'text-green-400 bg-green-500/10', 'in-progress': 'text-yellow-400 bg-yellow-500/10', todo: 'text-txt-4 bg-card' }

  const placeholder = PLACEHOLDERS[task.id] || 'Document your output, decision, or evidence here…'
  const thinkingSteps = THINKING_STEPS[task.id] || ['Analysing data…', 'Processing inputs…', 'Generating output…']

  const handleEval = () => {
    if (!localOut.trim()) return
    setEvaluating(true)
    setTaskOutput(stageId, task.id, localOut)
    setTimeout(() => {
      const r = evaluateTask(stageId, task.id)
      setEvalResult(r)
      setShowFeedback(true)
      setEvaluating(false)
    }, 500)
  }

  const handleComplete = (e) => {
    e.stopPropagation()
    if (!canAct || task.status === 'done') return
    if (localOut) setTaskOutput(stageId, task.id, localOut)
    completeTask(stageId, task.id)
    setExpanded(false)
  }

  const fb = task.feedback || evalResult

  return (
    <div
      id={`task-${task.id}`}
      className={`border-b border-line-faint last:border-0 transition-all duration-300
        ${forceExpanded && expanded ? 'ring-1 ring-blue-500/40 ring-inset rounded-xl' : ''}
        ${!canAct ? 'opacity-40 pointer-events-none' : ''}`}
    >
      {/* Header row */}
      <div className={`flex items-center gap-3 px-5 task-row-padding cursor-pointer transition-colors ${canAct ? 'hover:bg-card' : ''}`} onClick={() => canAct && setExpanded(e => !e)}>
        <button onClick={handleComplete}
          className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center text-[9px] transition-all
            ${task.status === 'done' ? 'bg-green-500 border-green-500 text-white' : 'border-txt-5 hover:border-blue-400'}`}
          disabled={task.status === 'done'}>
          {task.status === 'done' ? '✓' : task.status === 'in-progress' ? <div className="w-2 h-2 rounded-full bg-yellow-400" /> : null}
        </button>
        <span className={`flex-1 text-sm font-medium min-w-0 ${task.status === 'done' ? 'line-through text-txt-4' : 'text-txt'}`}>{task.title}</span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {task.score != null && <span className={`text-[9px] font-bold mono px-1.5 py-0.5 rounded-full border ${scoreColor(task.score)}`}>{task.score}/10</span>}
          {task.score != null && task.score < 6 && <span className="text-[8px] font-bold px-1 py-0.5 bg-red-500/10 text-red-400 rounded border border-red-500/20">WEAK</span>}
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${priorityBg[task.priority] || 'text-txt-5'}`}>{task.priority}</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${isAgent ? 'text-blue-400 bg-blue-500/10' : 'text-txt-3 bg-card'}`}>{task.owner}</span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusBg[task.status] || 'text-txt-5'}`}>{task.status === 'todo' ? 'Todo' : task.status === 'in-progress' ? 'Active' : 'Done'}</span>
          <span className="text-txt-5 text-xs ml-1">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Expanded body */}
      {expanded && canAct && (
        <div className="px-5 pb-4 pt-2 space-y-3 border-t border-line-faint">
          {task.hint && <p className="text-xs text-txt-3 bg-card rounded-lg px-3 py-2 leading-relaxed">💡 {task.hint}</p>}

          {isAgent ? (
            /* ─── Agent task UI ─── */
            <div className={`p-4 rounded-xl border-2 transition-all ${
              agentState === 'running' ? 'border-blue-400 bg-blue-500/8' :
              agentState === 'done' || agentState === 'accepted' ? 'border-green-400/40 bg-green-500/5' :
              'border-dashed border-line-strong bg-card'
            }`}>
              {/* Idle state */}
              {(!agentState || agentState === 'idle') && task.status !== 'done' && (
                <div className="text-center py-4">
                  <div className="text-2xl mb-2">🤖</div>
                  <p className="text-sm font-semibold text-txt mb-1">This task runs automatically via AI Agent</p>
                  <p className="text-xs text-txt-4 mb-4">{task.hint || 'Click below to trigger the agent.'}</p>
                  <button
                    onClick={() => runTaskAgent(stageId, task.id)}
                    className="px-6 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20">
                    🤖 Run Agent Now
                  </button>
                </div>
              )}

              {/* Running state */}
              {agentState === 'running' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="animate-spin text-blue-400 mono">⟳</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-400">Agent is working…</p>
                      <p className="text-xs text-txt-4">Analysing data and generating output</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {thinkingSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-txt-3">
                        <span className="animate-pulse text-blue-400">•</span> {step}
                      </div>
                    ))}
                  </div>
                  <div className="h-2 bg-card-hover rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '65%' }} />
                  </div>
                </div>
              )}

              {/* Done state — show output */}
              {(agentState === 'done' || agentState === 'accepted') && agentOut && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-400 text-lg">✓</span>
                    <p className="text-sm font-bold text-green-400">Agent completed successfully</p>
                  </div>
                  <div className="bg-panel rounded-xl p-4 border border-line">
                    <p className="text-[10px] font-bold text-txt-4 uppercase tracking-widest mono mb-2">Agent Output</p>
                    <pre className="text-xs text-txt-2 whitespace-pre-wrap mono leading-relaxed">{agentOut.output}</pre>
                  </div>
                  {agentState === 'done' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => { acceptAgentOutput(stageId, task.id); setLocalOut(agentOut.output) }}
                        className="flex-1 py-2 rounded-xl text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-colors">
                        ✓ Accept output & mark done
                      </button>
                      <button
                        onClick={() => dismissAgentOutput(task.id)}
                        className="px-4 py-2 rounded-xl text-xs text-txt-3 border border-line hover:bg-card transition-colors">
                        Re-run
                      </button>
                    </div>
                  )}
                  {agentState === 'accepted' && task.status !== 'done' && (
                    <button
                      onClick={(e) => handleComplete(e)}
                      className="w-full py-2 rounded-xl text-xs font-bold text-white bg-blue-500 hover:bg-blue-400 transition-colors">
                      ✓ Mark complete
                    </button>
                  )}
                </div>
              )}

              {/* Already done */}
              {task.status === 'done' && !agentOut && task.output && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 text-lg">✓</span>
                    <p className="text-sm font-bold text-green-400">Completed</p>
                  </div>
                  <pre className="text-xs text-txt-2 whitespace-pre-wrap mono leading-relaxed">{task.output}</pre>
                </div>
              )}
            </div>
          ) : (
            /* ─── Founder task UI ─── */
            <>
              {!localOut && task.status !== 'done' && (
                <p className="text-xs text-blue-400 font-semibold">
                  ✏️ Write your answer below — then click Evaluate to score it
                </p>
              )}

              <textarea value={localOut} onChange={e => { setLocalOut(e.target.value); setTaskOutput(stageId, task.id, e.target.value) }}
                disabled={task.status === 'done'}
                placeholder={placeholder}
                className="w-full bg-card border border-line rounded-xl px-3 py-2.5 text-xs text-txt placeholder-txt-5 resize-none focus:outline-none focus:border-blue-500/50 transition-colors leading-relaxed mono"
                rows={3} />

              {task.status !== 'done' && (
                <div className="flex gap-2 flex-wrap">
                  <button onClick={handleEval} disabled={!localOut.trim() || evaluating}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-card-hover hover:bg-card disabled:opacity-40 text-txt-2 text-xs font-semibold rounded-lg transition-colors border border-line">
                    {evaluating ? <span className="animate-spin mono">⟳</span> : '◆'} {evaluating ? 'Scoring…' : 'Evaluate'}
                  </button>
                  {fb && (
                    <button onClick={() => setShowFeedback(v => !v)}
                      className="px-3 py-1.5 bg-card text-txt-3 text-xs rounded-lg hover:bg-card-hover transition-colors ml-auto border border-line">
                      {showFeedback ? '▲ Hide' : '▼ Show'} feedback
                    </button>
                  )}
                  <button onClick={handleComplete}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-lg transition-colors ml-auto">
                    ✓ Done
                  </button>
                </div>
              )}

              {/* Feedback panel */}
              {showFeedback && fb && (
                <div className="rounded-xl overflow-hidden border border-line">
                  <div className="px-3 py-2 bg-card border-b border-line-faint flex items-center justify-between">
                    <span className="text-[10px] font-bold text-txt-3 uppercase tracking-wider">AI Feedback</span>
                    <span className={`text-[10px] font-bold mono px-2 py-0.5 rounded-full border ${scoreColor(fb.score)}`}>{fb.score}/10</span>
                  </div>
                  <div className="px-3 py-3 space-y-2">
                    {fb.strengths?.filter(Boolean).map((s, i) => <div key={i} className="text-xs text-txt-2 flex gap-2"><span className="text-green-400">✓</span>{s}</div>)}
                    {fb.gaps?.filter(Boolean).map((g, i) => <div key={i} className="text-xs text-txt-3 flex gap-2"><span className="text-red-400">✕</span>{g}</div>)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
