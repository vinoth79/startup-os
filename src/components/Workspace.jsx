import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import TaskRow from './TaskRow'

export default function Workspace() {
  const { stages } = useStore()
  const [activeProject, setActiveProject] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const projects = stages.filter(s => s.status !== 'locked').map(s => ({
    id: s.id, name: s.name, color: s.color, status: s.status, tasks: s.tasks,
    done: s.tasks.filter(t => t.status === 'done').length,
  }))

  const allTasks = stages.flatMap(s => s.tasks.map(t => ({ ...t, stageName: s.name, stageId: s.id, stageStatus: s.status })))
  const filtered = allTasks.filter(t => filterStatus === 'all' || t.status === filterStatus)

  const stats = [
    { label: 'Total Tasks', val: allTasks.length, color: 'text-txt' },
    { label: 'Done', val: allTasks.filter(t => t.status === 'done').length, color: 'text-green-400' },
    { label: 'In Progress', val: allTasks.filter(t => t.status === 'in-progress').length, color: 'text-yellow-400' },
    { label: 'Agent Tasks', val: allTasks.filter(t => t.owner === 'Agent').length, color: 'text-blue-400' },
  ]

  return (
    <div className="h-full overflow-hidden grid grid-cols-[240px_1fr]">
      {/* Left sidebar */}
      <div className="border-r border-line-faint overflow-y-auto p-4 bg-panel">
        <div className="text-[9px] mono font-bold text-txt-5 uppercase tracking-widest mb-3">Views</div>
        {['all', 'todo', 'in-progress', 'done'].map(f => {
          const cnt = f === 'all' ? allTasks.length : allTasks.filter(t => t.status === f).length
          const labels = { all: 'All Tasks', todo: 'To Do', 'in-progress': 'In Progress', done: 'Completed' }
          return (
            <button key={f} onClick={() => { setFilterStatus(f); setActiveProject(null) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-xs transition-all ${filterStatus === f && !activeProject ? 'bg-card-hover text-txt font-semibold' : 'text-txt-3 hover:text-txt-2 hover:bg-card'}`}>
              <span className="flex-1 text-left">{labels[f]}</span>
              <span className="mono text-txt-5 text-[9px]">{cnt}</span>
            </button>
          )
        })}

        <div className="text-[9px] mono font-bold text-txt-5 uppercase tracking-widest mb-3 mt-5">Projects</div>
        {projects.map(p => (
          <button key={p.id} onClick={() => { setActiveProject(activeProject === p.id ? null : p.id); setFilterStatus('all') }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-xs transition-all ${activeProject === p.id ? 'bg-card-hover text-txt font-semibold' : 'text-txt-3 hover:text-txt-2 hover:bg-card'}`}>
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: p.color }} />
            <span className="flex-1 text-left truncate">{p.name}</span>
            <span className="mono text-txt-5 text-[9px]">{p.done}/{p.tasks.length}</span>
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-txt">
              {activeProject ? projects.find(p => p.id === activeProject)?.name : 'All Tasks'}
            </h2>
            <p className="text-xs text-txt-4 mt-1">{filtered.length} tasks</p>
          </div>
          {/* Stats */}
          <div className="flex items-center gap-4">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className={`text-lg font-black mono ${s.color}`}>{s.val}</div>
                <div className="text-[9px] text-txt-4">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Task groups */}
        {activeProject ? (
          <div className="rounded-2xl border border-line bg-card overflow-hidden">
            {(() => {
              const proj = projects.find(p => p.id === activeProject)
              const stage = stages.find(s => s.id === activeProject)
              if (!proj || !stage) return null
              return (
                <>
                  <div className="px-5 py-3.5 border-b border-line-faint flex items-center gap-3">
                    <div className="w-3 h-3 rounded-sm" style={{ background: proj.color }} />
                    <span className="text-sm font-bold text-txt">{proj.name}</span>
                    <span className="text-xs text-txt-4">{proj.done}/{proj.tasks.length}</span>
                    <div className="flex-1 max-w-32 h-1 bg-card-hover rounded-full overflow-hidden ml-2">
                      <div className="h-full rounded-full" style={{ width: `${(proj.done / proj.tasks.length) * 100}%`, background: proj.color }} />
                    </div>
                  </div>
                  {stage.tasks.map(task => (
                    <TaskRow key={task.id} task={task} stageId={stage.id} stageStatus={stage.status} />
                  ))}
                </>
              )
            })()}
          </div>
        ) : (
          <>
            {stages.filter(s => s.status !== 'locked').map(stage => {
              const stageTasks = stage.tasks.filter(t => filterStatus === 'all' || t.status === filterStatus)
              if (stageTasks.length === 0) return null
              const done = stage.tasks.filter(t => t.status === 'done').length
              return (
                <div key={stage.id} className="rounded-2xl border border-line bg-card overflow-hidden mb-3">
                  <div className="px-5 py-3 border-b border-line-faint flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: stage.color }} />
                    <span className="text-sm font-semibold text-txt">{stage.name}</span>
                    <span className="text-xs text-txt-4 mono">{done}/{stage.tasks.length}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ml-auto ${stage.status === 'active' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                      {stage.status === 'active' ? 'Active' : 'Complete'}
                    </span>
                  </div>
                  {stageTasks.map(task => (
                    <TaskRow key={task.id} task={task} stageId={stage.id} stageStatus={stage.status} />
                  ))}
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
