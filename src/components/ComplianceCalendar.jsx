import React, { useState, useMemo } from 'react'
import { useStore } from '../store/useStore'
import { generateComplianceCalendar, getDaysUntil } from '../utils/generateCalendar'
import { generateCompliancePDF } from '../utils/generatePDF'
import { COMPLIANCE_CATEGORIES } from '../data/complianceRules'

const URGENCY_STYLES = {
  critical: 'bg-red-100 border-red-300 text-red-700',
  urgent: 'bg-orange-100 border-orange-300 text-orange-700',
  upcoming: 'bg-blue-100 border-blue-300 text-blue-700',
  planned: 'bg-green-100 border-green-300 text-green-700',
}

export default function ComplianceCalendar() {
  const { startup } = useStore()

  const [params, setParams] = useState({
    incorporationDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    hasGST: true,
    employeeCount: 3,
    state: 'Tamil Nadu',
    companyName: startup.name || 'Your Company',
  })
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [filterCat, setFilterCat] = useState('ALL')

  const calendarData = useMemo(() => {
    if (!generated) return null
    return generateComplianceCalendar(params)
  }, [params, generated])

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => { setGenerating(false); setGenerated(true) }, 1800)
  }

  const handleDownloadPDF = () => {
    if (!calendarData) return
    const pdf = generateCompliancePDF(calendarData)
    pdf.save(`${params.companyName.replace(/\s+/g, '_')}_Compliance_Calendar_${new Date().getFullYear()}.pdf`)
  }

  const filteredEvents = calendarData?.events?.filter(e => filterCat === 'ALL' || e.category === filterCat) || []

  return (
    <div className="space-y-4">
      {/* Config form */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">⚙️</span>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Ops Agent — Compliance Calendar</h3>
            <p className="text-xs text-gray-500 mt-0.5">Personalised 12-month Indian compliance calendar with penalties</p>
          </div>
          {generated && (
            <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 border border-green-200">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] font-bold text-green-700">Generated</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Company Name</label>
            <input value={params.companyName} onChange={e => setParams(p => ({ ...p, companyName: e.target.value }))}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Incorporation Date</label>
            <input type="date" value={params.incorporationDate} onChange={e => setParams(p => ({ ...p, incorporationDate: e.target.value }))}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">State</label>
            <select value={params.state} onChange={e => setParams(p => ({ ...p, state: e.target.value }))}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400 transition-colors">
              {['Tamil Nadu', 'Maharashtra', 'Karnataka', 'Delhi', 'Telangana', 'Gujarat', 'West Bengal', 'Rajasthan', 'Other'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Employees</label>
            <input type="number" min="1" max="200" value={params.employeeCount} onChange={e => setParams(p => ({ ...p, employeeCount: parseInt(e.target.value) || 1 }))}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={params.hasGST} onChange={e => setParams(p => ({ ...p, hasGST: e.target.checked }))} className="w-4 h-4 rounded" />
            <span className="text-sm text-gray-600">Company has GST registration</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button onClick={handleGenerate} disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all">
            {generating ? <><span className="animate-spin">⟳</span> Generating…</> : <><span>⚙️</span> {generated ? 'Regenerate' : 'Generate Calendar'}</>}
          </button>
          {generated && calendarData && (
            <button onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-sm font-bold rounded-xl transition-all">
              ↓ Download PDF
            </button>
          )}
        </div>
      </div>

      {/* Thinking animation */}
      {generating && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-2 text-blue-600 text-sm mb-2">
            <span className="animate-spin">⟳</span> Ops Agent scanning Indian compliance calendar…
          </div>
          <div className="space-y-1.5">
            {['Checking GST filing schedule…', 'Loading TDS deadlines…', 'Calculating ROC annual return dates…', 'Adding PF contribution schedule…'].map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-500"><span className="animate-pulse text-blue-400">•</span> {step}</div>
            ))}
          </div>
          <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '70%' }} />
          </div>
        </div>
      )}

      {/* Calendar display */}
      {generated && calendarData && !generating && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Total Events', value: calendarData.events.length, color: 'text-blue-600' },
              { label: 'Critical', value: calendarData.events.filter(e => e.urgency === 'critical').length, color: 'text-red-600' },
              { label: 'Urgent', value: calendarData.events.filter(e => e.urgency === 'urgent').length, color: 'text-orange-600' },
              { label: 'Months', value: Object.keys(calendarData.grouped).length, color: 'text-green-600' },
            ].map(s => (
              <div key={s.label} className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <div className={`text-2xl font-black mono ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-1.5 flex-wrap">
            <button onClick={() => setFilterCat('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCat === 'ALL' ? 'bg-gray-200 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
              All
            </button>
            {Object.entries(COMPLIANCE_CATEGORIES).map(([key, cat]) => (
              <button key={key} onClick={() => setFilterCat(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCat === key ? 'bg-gray-200 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Monthly event list */}
          {Object.entries(calendarData.grouped).map(([month, monthEvents]) => {
            const filtered = monthEvents.filter(e => filterCat === 'ALL' || e.category === filterCat)
            if (filtered.length === 0) return null
            return (
              <div key={month} className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-blue-50">
                  <h3 className="text-sm font-bold text-blue-700">{month}</h3>
                  <span className="text-xs text-gray-400 mono">{filtered.length} event{filtered.length !== 1 ? 's' : ''}</span>
                </div>
                {filtered.map((event, idx) => (
                  <div key={`${event.id}-${idx}`} className="flex items-start gap-4 px-5 py-3.5 border-b border-gray-100 last:border-0">
                    <div className="flex-shrink-0 text-center min-w-[60px]">
                      <div className="text-sm font-black mono text-gray-900">{event.dueDateStr.split(' ')[0]}</div>
                      <div className="text-[10px] text-gray-400">{event.dueDateStr.split(' ').slice(1).join(' ')}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold text-gray-900">{event.title}</span>
                        {event.critical && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-red-100 text-red-700 rounded border border-red-200">CRITICAL</span>}
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${URGENCY_STYLES[event.urgency]}`}>
                          {getDaysUntil(event.dueDate)} days
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{event.description}</p>
                      {event.form && <p className="text-[10px] text-gray-400 mono mt-1">Form: {event.form}</p>}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-[10px] text-orange-600 leading-relaxed max-w-[140px]">{event.penalty}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
