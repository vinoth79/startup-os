import React, { useState, useEffect } from 'react'
import { useStore, TASK_ELIGIBLE_ASSIGNEES } from '../store/useStore'

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

const AGENT_NAMES = {
  research: { icon: '🔍', name: 'Research Agent' },
  validation: { icon: '🎯', name: 'Validation Agent' },
  compliance: { icon: '⚖️', name: 'Compliance Agent' },
  finance: { icon: '💰', name: 'Finance Agent' },
  ops: { icon: '⚙️', name: 'Ops Agent' },
  cs: { icon: '👥', name: 'CS Agent' },
}

const ROLE_LABELS = {
  founder: 'Founder',
  cofounder: 'Co-founder',
  advisor: 'Advisor',
  ca: 'CA / Legal',
  engineer: 'Engineer',
  sales: 'Sales',
}

export default function TaskRow({ task, stageId, stageStatus, forceExpanded }) {
  const { completeTask, setTaskOutput, evaluateTask, runTaskAgent, acceptAgentOutput, dismissAgentOutput, reassignTask, taskAgentStates, taskAgentOutputs } = useStore()
  const [expanded, setExpanded] = useState(false)
  const [localOut, setLocalOut] = useState(task.output || '')
  const [evalResult, setEvalResult] = useState(task.feedback || null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => {
    if (forceExpanded) setExpanded(true)
  }, [forceExpanded])

  const canAct = stageStatus === 'active' || stageStatus === 'completed'
  const agentState = taskAgentStates[task.id]
  const agentOut = taskAgentOutputs[task.id]
  const isAgent = task.owner === 'Agent'

  // Eligibility
  const eligibility = TASK_ELIGIBLE_ASSIGNEES[task.id]
  const isLocked = eligibility?.locked
  const recommendedAgent = eligibility?.recommended
  const eligibleAgentIds = eligibility?.agents || []
  const eligibleHumanRoles = eligibility?.humans || ['founder']
  const contextNote = isAgent ? eligibility?.agentNote : (eligibility?.humanNote || eligibility?.reason)

  // Current assignee display
  const currentAssignee = task.assignedTo || (isAgent && recommendedAgent ? AGENT_NAMES[recommendedAgent]?.name : task.owner)

  const scoreColor = s => s >= 8 ? 'text-green-600 bg-green-50 border-green-200' : s >= 6 ? 'text-yellow-600 bg-yellow-50 border-yellow-200' : 'text-red-600 bg-red-50 border-red-200'
  const priorityColors = { Critical: 'text-red-600 bg-red-50', Important: 'text-orange-600 bg-orange-50', Optional: 'text-gray-500 bg-gray-100' }
  const statusColors = { done: 'text-green-600 bg-green-50', 'in-progress': 'text-blue-600 bg-blue-50', todo: 'text-gray-400 bg-gray-100' }

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

  const handleReassign = (name, ownerType) => {
    reassignTask(stageId, task.id, name, ownerType)
    setShowPicker(false)
  }

  const fb = task.feedback || evalResult

  return (
    <div
      id={`task-${task.id}`}
      className={`border-b border-gray-100 last:border-0 transition-all duration-300
        ${forceExpanded && expanded ? 'ring-1 ring-blue-300 ring-inset bg-blue-50/30' : ''}
        ${!canAct ? 'opacity-40 pointer-events-none' : ''}`}
    >
      {/* Header row */}
      <div className={`flex items-center gap-3 px-5 task-row-padding cursor-pointer transition-colors ${canAct ? 'hover:bg-gray-50' : ''}`} onClick={() => canAct && setExpanded(e => !e)}>
        <button onClick={handleComplete}
          className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center text-[9px] transition-all
            ${task.status === 'done' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-blue-400'}`}
          disabled={task.status === 'done'}>
          {task.status === 'done' ? '✓' : task.status === 'in-progress' ? <div className="w-2 h-2 rounded-full bg-blue-400" /> : null}
        </button>
        <span className={`flex-1 text-sm font-medium min-w-0 ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900'}`}>{task.title}</span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {task.score != null && <span className={`text-[9px] font-bold mono px-1.5 py-0.5 rounded-full border ${scoreColor(task.score)}`}>{task.score}/10</span>}
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${priorityColors[task.priority] || 'text-gray-400'}`}>{task.priority}</span>
          {/* Assignee badge */}
          {isLocked ? (
            <span className="text-[9px] px-1.5 py-0.5 rounded font-medium text-gray-500 bg-gray-100 flex items-center gap-1">🔒 {task.owner}</span>
          ) : (
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${isAgent ? 'text-blue-600 bg-blue-50' : 'text-gray-500 bg-gray-100'}`}>
              {currentAssignee}
            </span>
          )}
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusColors[task.status] || 'text-gray-400'}`}>
            {task.status === 'todo' ? 'Todo' : task.status === 'in-progress' ? 'Active' : 'Done'}
          </span>
          <span className="text-gray-300 text-xs ml-1">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Expanded body */}
      {expanded && canAct && (
        <div className="px-5 pb-4 pt-2 space-y-3 border-t border-gray-100">
          {/* Hint */}
          {task.hint && <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">💡 {task.hint}</p>}

          {/* Assignee picker bar */}
          {task.status !== 'done' && (
            <div className="relative">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide flex-shrink-0">Assigned to:</span>
                <span className={`text-xs font-bold ${isAgent ? 'text-blue-600' : 'text-gray-800'}`}>{currentAssignee}</span>
                {recommendedAgent && (task.assignedTo || '').includes(AGENT_NAMES[recommendedAgent]?.name) !== false && isAgent && (
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-bold">Best fit</span>
                )}
                {isLocked ? (
                  <span className="ml-auto text-[10px] text-gray-400 flex items-center gap-1">🔒 Locked — {eligibility?.reason?.split('.')[0]}</span>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowPicker(p => !p) }}
                    className="ml-auto text-[10px] font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
                    Change ▾
                  </button>
                )}
              </div>

              {/* Dropdown picker */}
              {showPicker && !isLocked && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                  {/* Humans section */}
                  {eligibleHumanRoles.length > 0 && (
                    <div className="px-3 pt-3 pb-1">
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">People</div>
                      {eligibleHumanRoles.map(role => (
                        <button key={role} onClick={() => handleReassign(ROLE_LABELS[role] || role, 'Founder')}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors mb-1 ${
                            currentAssignee === (ROLE_LABELS[role] || role) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                          }`}>
                          <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">👤</span>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-gray-800 capitalize">{ROLE_LABELS[role] || role}</div>
                          </div>
                          {currentAssignee === (ROLE_LABELS[role] || role) && <span className="text-blue-500 text-xs">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Agents section */}
                  {eligibleAgentIds.length > 0 && (
                    <div className={`px-3 pb-3 ${eligibleHumanRoles.length > 0 ? 'pt-1 border-t border-gray-100' : 'pt-3'}`}>
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">AI Agents</div>
                      {eligibleAgentIds.map(aid => {
                        const agent = AGENT_NAMES[aid]
                        const isRec = aid === recommendedAgent
                        const isSelected = currentAssignee === agent?.name
                        return (
                          <button key={aid} onClick={() => handleReassign(agent?.name || aid, 'Agent')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors mb-1 ${
                              isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                            }`}>
                            <span className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-xs">{agent?.icon || '🤖'}</span>
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                                {agent?.name || aid}
                                {isRec && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[8px] font-bold">Recommended</span>}
                              </div>
                            </div>
                            {isSelected && <span className="text-blue-500 text-xs">✓</span>}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Context note at bottom */}
                  {contextNote && (
                    <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-500 leading-relaxed">
                      💡 {contextNote}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {isAgent ? (
            /* ─── Agent task UI ─── */
            <div className={`p-4 rounded-xl border-2 transition-all ${
              agentState === 'running' ? 'border-blue-300 bg-blue-50' :
              agentState === 'done' || agentState === 'accepted' ? 'border-green-300 bg-green-50' :
              'border-dashed border-gray-300 bg-gray-50'
            }`}>
              {(!agentState || agentState === 'idle') && task.status !== 'done' && (
                <div className="text-center py-4">
                  <div className="text-2xl mb-2">🤖</div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    {recommendedAgent ? `${AGENT_NAMES[recommendedAgent]?.icon} ${AGENT_NAMES[recommendedAgent]?.name} is ready` : 'This task runs via AI Agent'}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">{eligibility?.agentNote || task.hint || 'Click below to trigger the agent.'}</p>
                  <button onClick={() => runTaskAgent(stageId, task.id)}
                    className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20">
                    🤖 Run {recommendedAgent ? AGENT_NAMES[recommendedAgent]?.name : 'Agent'} Now
                  </button>
                </div>
              )}

              {agentState === 'running' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="animate-spin text-blue-500 mono">⟳</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-600">{recommendedAgent ? AGENT_NAMES[recommendedAgent]?.name : 'Agent'} is working…</p>
                      <p className="text-xs text-gray-500">Analysing data and generating output</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {thinkingSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="animate-pulse text-blue-400">•</span> {step}
                      </div>
                    ))}
                  </div>
                  <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '65%' }} />
                  </div>
                </div>
              )}

              {(agentState === 'done' || agentState === 'accepted') && agentOut && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-500 text-lg">✓</span>
                    <p className="text-sm font-bold text-green-600">{recommendedAgent ? AGENT_NAMES[recommendedAgent]?.name : 'Agent'} completed</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mono mb-2">Agent Output</p>
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap mono leading-relaxed">{agentOut.output}</pre>
                  </div>
                  {agentState === 'done' && (
                    <div className="flex gap-2">
                      <button onClick={() => { acceptAgentOutput(stageId, task.id); setLocalOut(agentOut.output) }}
                        className="flex-1 py-2 rounded-xl text-xs font-bold text-green-700 bg-green-100 border border-green-200 hover:bg-green-200 transition-colors">
                        ✓ Accept & mark done
                      </button>
                      <button onClick={() => dismissAgentOutput(task.id)}
                        className="px-4 py-2 rounded-xl text-xs text-gray-500 border border-gray-200 hover:bg-gray-100 transition-colors">
                        Re-run
                      </button>
                    </div>
                  )}
                  {agentState === 'accepted' && task.status !== 'done' && (
                    <button onClick={(e) => handleComplete(e)}
                      className="w-full py-2 rounded-xl text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 transition-colors">
                      ✓ Mark complete
                    </button>
                  )}
                </div>
              )}

              {task.status === 'done' && !agentOut && task.output && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 text-lg">✓</span>
                    <p className="text-sm font-bold text-green-600">Completed</p>
                  </div>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap mono leading-relaxed">{task.output}</pre>
                </div>
              )}
            </div>
          ) : (
            /* ─── Founder task UI ─── */
            <>
              {!localOut && task.status !== 'done' && (
                <p className="text-xs text-blue-600 font-semibold">
                  ✏️ Write your answer below — then click Evaluate to score it
                </p>
              )}

              <textarea value={localOut} onChange={e => { setLocalOut(e.target.value); setTaskOutput(stageId, task.id, e.target.value) }}
                disabled={task.status === 'done'}
                placeholder={placeholder}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors leading-relaxed mono"
                rows={3} />

              {task.status !== 'done' && (
                <div className="flex gap-2 flex-wrap">
                  <button onClick={handleEval} disabled={!localOut.trim() || evaluating}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 text-xs font-semibold rounded-lg transition-colors border border-gray-200">
                    {evaluating ? <span className="animate-spin mono">⟳</span> : '◆'} {evaluating ? 'Scoring…' : 'Evaluate'}
                  </button>
                  {fb && (
                    <button onClick={() => setShowFeedback(v => !v)}
                      className="px-3 py-1.5 bg-gray-50 text-gray-500 text-xs rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                      {showFeedback ? '▲ Hide' : '▼ Show'} feedback
                    </button>
                  )}
                  <button onClick={handleComplete}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors ml-auto">
                    ✓ Done
                  </button>
                </div>
              )}

              {showFeedback && fb && (
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">AI Feedback</span>
                    <span className={`text-[10px] font-bold mono px-2 py-0.5 rounded-full border ${scoreColor(fb.score)}`}>{fb.score}/10</span>
                  </div>
                  <div className="px-3 py-3 space-y-2 bg-white">
                    {fb.strengths?.filter(Boolean).map((s, i) => <div key={i} className="text-xs text-gray-700 flex gap-2"><span className="text-green-500">✓</span>{s}</div>)}
                    {fb.gaps?.filter(Boolean).map((g, i) => <div key={i} className="text-xs text-gray-500 flex gap-2"><span className="text-red-400">✕</span>{g}</div>)}
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
