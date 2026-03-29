import React, { useState } from 'react'
import { useStore } from '../store/useStore'

const INDUSTRIES = ['Fintech', 'SaaS / B2B Software', 'HealthTech', 'EdTech', 'E-commerce', 'DeepTech', 'Consumer', 'Other']

export default function Onboarding() {
  const { setStartup, theme, toggleTheme } = useStore()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', industry: '', founderExp: '' })
  const [error, setError] = useState('')

  const next = () => {
    if (step === 1 && !form.name.trim()) { setError('Enter your startup name'); return }
    if (step === 2 && !form.industry) { setError('Select your industry'); return }
    if (step === 3 && !form.founderExp) { setError('Select your experience level'); return }
    setError('')
    if (step < 3) setStep(s => s + 1)
    else setStartup(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay backdrop-blur-md">
      <div className="w-full max-w-md mx-4 bg-elevated border border-line rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-8 pt-8 pb-6 border-b border-line">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-blue-500/30">OS</div>
            <span className="text-sm font-bold text-txt-2 uppercase tracking-widest mono">Startup OS</span>
            <button onClick={toggleTheme} className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-txt-4 hover:text-txt-2 hover:bg-card-hover transition-all text-sm" title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? '☀' : '◗'}
            </button>
          </div>
          <div className="flex gap-1.5 mb-5">
            {[1, 2, 3].map(i => <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-blue-500' : 'bg-card-hover'}`} />)}
          </div>
          <h1 className="text-xl font-bold text-txt">
            {step === 1 ? "What's your startup called?" : step === 2 ? 'What are you building?' : 'How experienced are you?'}
          </h1>
          <p className="text-txt-4 text-sm mt-1.5">
            {step === 1 ? "You can change this later." : step === 2 ? 'Helps the system tune recommendations.' : 'Calibrates your founder-market fit score.'}
          </p>
        </div>

        <div className="px-8 py-6">
          {step === 1 && (
            <input autoFocus type="text" placeholder="e.g. GyanMatrix Technologies"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && next()}
              className="w-full px-4 py-3.5 bg-card border border-line rounded-xl text-txt placeholder-txt-5 focus:outline-none focus:border-blue-500/60 text-sm transition-colors" />
          )}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-2">
              {INDUSTRIES.map(ind => (
                <button key={ind} onClick={() => setForm(f => ({ ...f, industry: ind }))}
                  className={`px-3 py-3 rounded-xl text-xs font-medium text-left transition-all border ${form.industry === ind ? 'bg-blue-500/15 border-blue-500/40 text-blue-300' : 'bg-card border-line text-txt-3 hover:border-line-strong hover:text-txt-2'}`}>
                  {ind}
                </button>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-2">
              {[
                { value: 'first', label: 'First-time founder', sub: 'This is my first startup', score: '8/30 fit' },
                { value: 'some', label: '3–5 years domain exp', sub: 'Some relevant experience', score: '18/30 fit' },
                { value: 'expert', label: 'Domain expert', sub: '6+ years, deep network', score: '28/30 fit' },
              ].map(opt => (
                <button key={opt.value} onClick={() => setForm(f => ({ ...f, founderExp: opt.value }))}
                  className={`w-full px-4 py-3.5 rounded-xl text-left transition-all border flex items-center justify-between ${form.founderExp === opt.value ? 'bg-blue-500/15 border-blue-500/40' : 'bg-card border-line hover:border-line-strong'}`}>
                  <div>
                    <div className={`text-sm font-semibold ${form.founderExp === opt.value ? 'text-blue-300' : 'text-txt'}`}>{opt.label}</div>
                    <div className="text-xs text-txt-4 mt-0.5">{opt.sub}</div>
                  </div>
                  <span className="text-[10px] mono text-txt-5">{opt.score}</span>
                </button>
              ))}
            </div>
          )}
          {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
        </div>

        <div className="px-8 pb-8 flex items-center justify-between">
          {step > 1
            ? <button onClick={() => setStep(s => s - 1)} className="text-sm text-txt-4 hover:text-txt-2 transition-colors">← Back</button>
            : <div />}
          <button onClick={next}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20">
            {step === 3 ? '🚀 Launch Startup OS' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}
