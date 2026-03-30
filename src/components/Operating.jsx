import React, { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import TaskRow from './TaskRow'

/* ─── Live decision builder ─── */
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
      { type: hasProblem ? 'ok' : 'bad', text: hasProblem ? `Problem defined: "${output('pre-1').slice(0, 80)}${output('pre-1').length > 80 ? '…' : ''}"` : 'No problem statement defined yet' },
      { type: hasICP ? 'ok' : 'bad', text: hasICP ? `ICP confirmed: ${output('pre-2').slice(0, 70)}${output('pre-2').length > 70 ? '…' : ''}` : 'ICP not identified' },
      { type: hasTAM ? 'ok' : 'bad', text: hasTAM ? `Market validated: ${output('pre-4').slice(0, 70)}${output('pre-4').length > 70 ? '…' : ''}` : 'Market size unknown — trigger Research Agent' },
      { type: hasFounderFit ? 'ok' : 'warn', text: hasFounderFit ? `Founder-market fit assessed` : 'Founder-market fit not yet assessed' },
      { type: hasAgreement ? 'ok' : 'warn', text: hasAgreement ? 'Co-founders agreement signed' : 'Co-founders agreement not yet signed' },
    ]
    const doneCount = [hasProblem, hasICP, hasFounderFit, hasTAM, hasAgreement].filter(Boolean).length
    return { signals, targetTaskId: !hasProblem ? 'pre-1' : !hasICP ? 'pre-2' : !hasTAM ? 'pre-4' : !hasFounderFit ? 'pre-3' : !hasAgreement ? 'pre-5' : null }
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
      { type: hasInterviews ? 'ok' : 'bad', text: hasInterviews ? `Interviews complete` : '15 discovery interviews not yet done' },
      { type: hasAnalysis ? 'ok' : 'warn', text: hasAnalysis ? `Validation Agent analysis done` : 'Validation Agent analysis pending' },
      { type: hasRetention ? 'ok' : 'warn', text: hasRetention ? 'D7 retention target met' : 'D7 retention below 70% target' },
      { type: hasPreSells ? 'ok' : 'bad', text: hasPreSells ? 'Pre-sell commitments collected' : 'Pre-sell commitments needed' },
    ]
    return { signals, targetTaskId: !hasHypothesis ? 'val-1' : !hasInterviews ? 'val-2' : !hasAnalysis ? 'val-3' : !hasRetention ? 'val-4' : !hasPreSells ? 'val-5' : !hasPMF ? 'val-6' : null }
  }

  // Generic
  return {
    signals: tasks.map(t => ({ type: t.status === 'done' ? 'ok' : 'bad', text: t.status === 'done' ? `${t.title} — done` : `${t.title} — pending` })),
    targetTaskId: tasks.find(t => t.status !== 'done')?.id || null,
  }
}

/* ─── Stage taglines ─── */
const STAGE_TAGLINES = {
  pre: 'Validate idea before committing',
  val: 'Talk to real users, test demand',
  inc: 'Register your company legally',
  setup: 'GST, PF, bank, compliance',
  ops: 'Run your business with agents',
  growth: 'Scale what is working',
  exit: 'Maximise founder wealth',
}

/* ─── Milestone groups ─── */
const MILESTONE_GROUPS = {
  pre: [
    { id: 'mg-pre-1', title: 'Define your problem', description: 'Articulate the pain you are solving in one clear sentence', taskIds: ['pre-1', 'pre-2'] },
    { id: 'mg-pre-2', title: 'Understand your market', description: 'Validate that the market is large enough to build a business', taskIds: ['pre-4'] },
    { id: 'mg-pre-3', title: 'Validate founder fit', description: 'Assess whether you are the right person to solve this problem', taskIds: ['pre-3'] },
    { id: 'mg-pre-4', title: 'Make your decision', description: 'Review all signals and decide: incorporate, pivot, or defer', taskIds: ['pre-5'], isDecisionGate: true },
  ],
  val: [
    { id: 'mg-val-1', title: 'Write your hypothesis', description: 'Define what you believe and what would prove you wrong', taskIds: ['val-1'] },
    { id: 'mg-val-2', title: 'Talk to real customers', description: 'Conduct discovery interviews — ask about past behaviour only', taskIds: ['val-2', 'val-3'] },
    { id: 'mg-val-3', title: 'Prove willingness to pay', description: 'Get paid pre-sells and retention signal before building', taskIds: ['val-4', 'val-5'] },
    { id: 'mg-val-4', title: 'Score PMF signal', description: 'Run final assessment — need 7.5+ to proceed to incorporation', taskIds: ['val-6'], isDecisionGate: true },
  ],
}

/* ─── Milestone group component ─── */
function MilestoneGroup({ group, groupNum, stageTasks, stageId, stageStatus, expandedTaskId, setExpandedTaskId, isFirstIncompleteGroup }) {
  const groupTasks = stageTasks.filter(t => group.taskIds.includes(t.id))
  const allDone = groupTasks.every(t => t.status === 'done')
  const someInProgress = groupTasks.some(t => t.status === 'in-progress' || t.status === 'done')

  return (
    <div className={`rounded-2xl border transition-all ${
      allDone ? 'border-green-200 bg-green-50/50' :
      someInProgress || isFirstIncompleteGroup ? 'border-blue-200 bg-blue-50/30' :
      'border-gray-200 bg-white'
    }`}>
      {/* Group header */}
      <div className="flex items-center gap-4 px-6 py-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
          allDone ? 'bg-green-500 text-white' :
          someInProgress || isFirstIncompleteGroup ? 'bg-blue-500 text-white' :
          'bg-gray-100 text-gray-400'
        }`}>
          {allDone ? '✓' : groupNum}
        </div>
        <div className="flex-1">
          <h3 className={`text-base font-bold ${allDone ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
            {group.title}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{group.description}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          allDone ? 'bg-green-100 text-green-700' :
          someInProgress || isFirstIncompleteGroup ? 'bg-blue-100 text-blue-700' :
          group.isDecisionGate ? 'bg-orange-100 text-orange-600' :
          'bg-gray-100 text-gray-400'
        }`}>
          {allDone ? 'Done' : (someInProgress || isFirstIncompleteGroup) ? 'In progress' : group.isDecisionGate ? 'Decision gate' : 'Upcoming'}
        </div>
      </div>

      {/* Tasks — show when active or done */}
      {(someInProgress || allDone || isFirstIncompleteGroup) ? (
        <div className="border-t border-gray-100">
          {groupTasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              stageId={stageId}
              stageStatus={stageStatus}
              forceExpanded={expandedTaskId === task.id}
            />
          ))}
        </div>
      ) : (
        <div className="border-t border-gray-100 px-6 py-3">
          <p className="text-xs text-gray-400">
            {groupTasks.length} task{groupTasks.length > 1 ? 's' : ''} · Complete previous step to unlock
          </p>
        </div>
      )}
    </div>
  )
}

export default function Operating() {
  const { stages, startup, getConfidence, addSignal, runTaskAgent, taskAgentStates } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [expandedTaskId, setExpandedTaskId] = useState(null)

  const active = stages.find(s => s.status === 'active') || stages[0]
  const conf = getConfidence()
  const decision = buildLiveDecision(active, conf)

  // Auto-trigger agent when an agent task is force-expanded
  useEffect(() => {
    if (!expandedTaskId) return
    const task = active?.tasks.find(t => t.id === expandedTaskId)
    if (!task || task.owner !== 'Agent' || task.status === 'done') return
    const currentState = taskAgentStates[expandedTaskId]
    if (!currentState || currentState === 'idle') {
      const timer = setTimeout(() => { runTaskAgent(active.id, expandedTaskId) }, 600)
      return () => clearTimeout(timer)
    }
  }, [expandedTaskId])

  const handleStartStep = () => {
    const targetId = decision.targetTaskId
    const targetTask = targetId ? active.tasks.find(t => t.id === targetId) : active.tasks.find(t => t.status !== 'done')
    if (!targetTask || targetTask.status === 'done') {
      const anyIncomplete = active.tasks.find(t => t.status !== 'done')
      if (!anyIncomplete) { setShowModal(true); return }
      setExpandedTaskId(anyIncomplete.id)
      setTimeout(() => { document.getElementById(`task-${anyIncomplete.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }, 50)
      return
    }
    setExpandedTaskId(targetTask.id)
    setTimeout(() => { document.getElementById(`task-${targetTask.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }, 50)
    if (targetTask.owner !== 'Agent') {
      setTimeout(() => { document.getElementById(`task-${targetTask.id}`)?.querySelector('textarea')?.focus() }, 500)
    }
  }

  // Milestone groups for the active stage, or fall back to flat list
  const milestones = MILESTONE_GROUPS[active.id]
  const tasksDone = active.tasks.filter(t => t.status === 'done').length

  // Find first incomplete milestone group
  const firstIncompleteGroupIdx = milestones
    ? milestones.findIndex(g => {
        const gTasks = active.tasks.filter(t => g.taskIds.includes(t.id))
        return !gTasks.every(t => t.status === 'done')
      })
    : -1

  return (
    <div className="h-full overflow-hidden flex flex-col bg-[#f8f7f4]">
      {/* ─── Stage stepper ─── */}
      <div className="flex-shrink-0 px-8 py-5 border-b border-black/6 bg-white/80">
        <div className="flex items-start gap-0">
          {stages.map((stage, i) => {
            const isActive = stage.status === 'active'
            const isDone = stage.status === 'completed'
            return (
              <div key={stage.id} className="flex items-start flex-1">
                <div className="flex flex-col items-center" style={{ minWidth: 80 }}>
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all
                    ${isDone ? 'bg-blue-500 border-blue-500 text-white' :
                      isActive ? 'bg-white border-blue-500 text-blue-500' :
                      'bg-white border-gray-200 text-gray-300'}`}>
                    {isDone ? '✓' : stage.num}
                  </div>
                  <div className="mt-2 text-center px-1">
                    <div className={`text-sm font-semibold ${isActive ? 'text-gray-900' : isDone ? 'text-gray-400' : 'text-gray-300'}`}>
                      {stage.short}
                    </div>
                    <div className={`text-[11px] mt-0.5 leading-tight ${isActive ? 'text-gray-500' : 'text-gray-300'}`}>
                      {STAGE_TAGLINES[stage.id] || ''}
                    </div>
                    {isActive && (
                      <div className="mt-1.5 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-[9px] font-semibold text-blue-600 inline-block">
                        You are here
                      </div>
                    )}
                  </div>
                </div>
                {i < stages.length - 1 && (
                  <div className={`flex-1 h-0.5 mt-5 ${isDone ? 'bg-blue-500' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Center pane ─── */}
      <div className="flex-1 overflow-y-auto">
        {/* Stage header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{active.name}: {active.goal}</h2>
          <p className="text-sm text-gray-500">
            Complete each step to build confidence in your decision. Each task feeds the confidence score.
          </p>
        </div>

        {/* Milestone groups */}
        <div className="px-8 py-6 space-y-4">
          {milestones ? (
            milestones.map((group, idx) => {
              const isFirstIncomplete = idx === firstIncompleteGroupIdx
              return (
                <div key={group.id}>
                  {/* "Start this step" link on first incomplete group */}
                  {isFirstIncomplete && tasksDone < active.tasks.length && (
                    <button onClick={handleStartStep} className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 mb-3 transition-colors">
                      <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">▶</span>
                      Start this step →
                    </button>
                  )}
                  <MilestoneGroup
                    group={group}
                    groupNum={idx + 1}
                    stageTasks={active.tasks}
                    stageId={active.id}
                    stageStatus={active.status}
                    expandedTaskId={expandedTaskId}
                    setExpandedTaskId={setExpandedTaskId}
                    isFirstIncompleteGroup={isFirstIncomplete}
                  />
                </div>
              )
            })
          ) : (
            /* Fallback: flat task list for stages without milestone groups */
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Stage Tasks</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{tasksDone}/{active.tasks.length} complete</p>
                </div>
                {tasksDone < active.tasks.length && (
                  <button onClick={handleStartStep} className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    Start next task →
                  </button>
                )}
              </div>
              {active.tasks.map(task => (
                <TaskRow key={task.id} task={task} stageId={active.id} stageStatus={active.status} forceExpanded={expandedTaskId === task.id} />
              ))}
            </div>
          )}

          {/* All tasks done — decision prompt */}
          {tasksDone === active.tasks.length && (
            <div className="rounded-2xl border-2 border-green-300 bg-green-50 p-6 text-center">
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">All tasks complete</h3>
              <p className="text-sm text-gray-500 mb-4">Review signals in the right panel, then make your stage decision.</p>
              <button onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20">
                Make Stage Decision →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Decision modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">{active.decision}</h3>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all text-sm">✕</button>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Proceed — signals are strong enough', desc: 'Move to the next stage and unlock new tasks.', primary: true },
                { label: 'Defer — need more data', desc: 'Wait for additional signals before deciding.', primary: false },
                { label: 'Escalate to advisor', desc: 'Get an expert second opinion before committing.', primary: false },
              ].map((opt, i) => (
                <div key={i} onClick={() => { addSignal(`Decision: ${opt.label}`, 'milestone', i === 0 ? 3 : -1); setShowModal(false) }}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${opt.primary ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                  <div className="text-sm font-bold text-gray-900 mb-1">{opt.label}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
