import { create } from 'zustand'

/* ─── Initial stage definitions ─── */
const INITIAL_STAGES = [
  {
    id: 'pre', num: '01', name: 'Pre-Incorporation', short: 'Pre-Inc',
    status: 'active', color: '#3b82f6', pct: 0,
    goal: 'Validate the problem before spending a single rupee.',
    decision: 'Is this problem worth building a company around?',
    recommendation: 'Define your problem before anything else',
    recType: 'proceed',
    confidence: 8, riskLevel: 'High',
    tasks: [
      { id: 'pre-1', title: 'Write problem statement', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null, hint: 'One sentence: who has what problem, how painful is it, and what does it cost them today?' },
      { id: 'pre-2', title: 'Define ICP', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null, hint: 'Ideal Customer Profile — industry, size, title, pain level, reachability.' },
      { id: 'pre-3', title: 'Founder-market fit audit', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null, hint: 'Your domain years, direct customer access, unfair advantages.' },
      { id: 'pre-4', title: 'Validate TAM', owner: 'Agent', priority: 'Critical', status: 'todo', output: '', score: null, hint: 'Use the Research Agent to estimate TAM, SAM, SOM with sources.' },
      { id: 'pre-5', title: 'Sign co-founders agreement', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null, hint: 'Equity split, vesting schedule, IP assignment. Non-negotiable before incorporation.' },
    ],
    signals: [
      { type: 'bad', text: 'No problem statement defined yet' },
      { type: 'bad', text: 'ICP not identified' },
      { type: 'bad', text: 'Market size unknown' },
    ],
    costImpact: null,
    history: [],
  },
  {
    id: 'val', num: '02', name: 'Validation', short: 'Validate',
    status: 'locked', color: '#f59e0b', pct: 0,
    goal: 'Prove real people will pay before building.',
    decision: 'Should you proceed to incorporation this week?',
    recommendation: 'Complete validation tasks first',
    recType: 'hold',
    confidence: 0, riskLevel: 'High',
    tasks: [
      { id: 'val-1', title: 'Write testable hypothesis', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null, hint: '[ICP] will pay [price] for [solution] because [reason].' },
      { id: 'val-2', title: 'Conduct 15 discovery interviews', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null, hint: 'Record how many confirm the pain unprompted. Target: 10/15+.' },
      { id: 'val-3', title: 'Run Validation Agent analysis', owner: 'Agent', priority: 'Critical', status: 'todo', output: '', score: null, hint: 'PMF scorecard — CVR, interviews, pre-sells, D7 retention.' },
      { id: 'val-4', title: 'Improve D7 retention to 70%+', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null, hint: 'Track day-7 return rate. Below 70% means the hook is weak.' },
      { id: 'val-5', title: 'Collect 2 more pre-sell commitments', owner: 'Founder', priority: 'Important', status: 'todo', output: '', score: null, hint: 'Paid commitments before the product exists — strongest signal.' },
      { id: 'val-6', title: 'Score PMF ≥ 7.5/10 with updated data', owner: 'Agent', priority: 'Important', status: 'todo', output: '', score: null, hint: 'Re-run Validation Agent after retention and pre-sell updates.' },
    ],
    signals: [],
    costImpact: { action: 'Proceeding to incorporation now', items: ['+₹45K legal spend', 'Runway impact if pivot needed', 'Risk: wasted if problem invalidated'] },
    history: [],
  },
  {
    id: 'inc', num: '03', name: 'Incorporation', short: 'Incorporate',
    status: 'locked', color: '#f97316', pct: 0,
    goal: 'Certificate of Incorporation received. Bank account open.',
    decision: 'File SPICe+ this week?',
    recommendation: 'Complete all pre-conditions first',
    recType: 'proceed',
    confidence: 0, riskLevel: 'Low',
    tasks: [
      { id: 'inc-1', title: 'Choose business structure', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null },
      { id: 'inc-2', title: 'Reserve company name on MCA', owner: 'Agent', priority: 'Critical', status: 'todo', output: '', score: null },
      { id: 'inc-3', title: 'Obtain DSC tokens', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null },
      { id: 'inc-4', title: 'File SPICe+ Part B', owner: 'Agent', priority: 'Critical', status: 'todo', output: '', score: null },
      { id: 'inc-5', title: 'Open company bank account', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null },
      { id: 'inc-6', title: 'File INC-20A commencement', owner: 'Agent', priority: 'Critical', status: 'todo', output: '', score: null },
    ],
    signals: [],
    costImpact: null,
    history: [],
  },
  {
    id: 'setup', num: '04', name: 'Setup', short: 'Setup',
    status: 'locked', color: '#8b5cf6', pct: 0,
    goal: 'Company is legally compliant and financially clean.',
    decision: 'Activate compliance calendar?',
    recommendation: 'Complete all pre-conditions first',
    recType: 'proceed',
    confidence: 0, riskLevel: 'Low',
    tasks: [
      { id: 'setup-1', title: 'Set up accounting + bank feed', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null },
      { id: 'setup-2', title: 'Register GST proactively', owner: 'Agent', priority: 'Critical', status: 'todo', output: '', score: null },
      { id: 'setup-3', title: 'File trademark', owner: 'Agent', priority: 'Critical', status: 'todo', output: '', score: null },
      { id: 'setup-4', title: 'Employment agreements + IP assignment', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null },
    ],
    signals: [],
    costImpact: null,
    history: [],
  },
  {
    id: 'ops', num: '05', name: 'Early Operations', short: 'Operations',
    status: 'locked', color: '#22c55e', pct: 0,
    goal: 'D30 churn < 5%, NRR > 100%, one scalable channel.',
    decision: 'Should you scale acquisition now?',
    recommendation: 'Complete all pre-conditions first',
    recType: 'stop',
    confidence: 0, riskLevel: 'High',
    tasks: [
      { id: 'ops-1', title: 'Close first 10 customers', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null },
      { id: 'ops-2', title: 'Document sales playbook', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null },
      { id: 'ops-3', title: 'Fix churn root cause', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null },
      { id: 'ops-4', title: 'Prove scalable acquisition channel', owner: 'Agent', priority: 'Critical', status: 'todo', output: '', score: null },
    ],
    signals: [],
    costImpact: null,
    history: [],
  },
  {
    id: 'growth', num: '06', name: 'Growth', short: 'Growth',
    status: 'locked', color: '#14b8a6', pct: 0,
    goal: 'Series A closed. ₹1 Cr MRR trajectory.',
    decision: 'Raise Series A now or wait 3 months?',
    recommendation: 'Complete all pre-conditions first',
    recType: 'proceed',
    confidence: 0, riskLevel: 'Medium',
    tasks: [
      { id: 'growth-1', title: 'Prepare Series A data room', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null },
      { id: 'growth-2', title: 'Close Series A round', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null },
      { id: 'growth-3', title: 'Hire VP Sales + VP Engineering', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null },
    ],
    signals: [],
    costImpact: null,
    history: [],
  },
  {
    id: 'exit', num: '07', name: 'Exit', short: 'Exit',
    status: 'locked', color: '#eab308', pct: 0,
    goal: 'Definitive Agreement signed at 7–9× ARR.',
    decision: 'Counter the LOI at 8× ARR?',
    recommendation: 'Complete all pre-conditions first',
    recType: 'hold',
    confidence: 0, riskLevel: 'High',
    tasks: [
      { id: 'exit-1', title: 'Exit readiness audit', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null },
      { id: 'exit-2', title: 'Negotiate Definitive Agreement', owner: 'Founder', priority: 'Critical', status: 'todo', output: '', score: null },
    ],
    signals: [],
    costImpact: null,
    history: [],
  },
]

/* ─── AGENT DATA ─── */
const INITIAL_AGENTS = [
  { id: 'research', name: 'Research Agent', icon: '🔍', role: 'Market & Competitive Intelligence', status: 'idle', task: 'Standby', pct: 0, humanPct: 10, agentPct: 90, lastOutput: '' },
  { id: 'validation', name: 'Validation Agent', icon: '🎯', role: 'PMF Analysis & Signal Synthesis', status: 'idle', task: 'Standby', pct: 0, humanPct: 45, agentPct: 55, lastOutput: '' },
  { id: 'compliance', name: 'Compliance Agent', icon: '⚖️', role: 'Legal & Regulatory Execution', status: 'idle', task: 'Standby', pct: 0, humanPct: 35, agentPct: 65, lastOutput: '' },
  { id: 'finance', name: 'Finance Agent', icon: '💰', role: 'Cap Table & Financial Planning', status: 'idle', task: 'Standby', pct: 0, humanPct: 30, agentPct: 70, lastOutput: '' },
  { id: 'ops', name: 'Ops Agent', icon: '⚙️', role: 'Operations & Compliance Calendar', status: 'idle', task: 'Standby', pct: 0, humanPct: 40, agentPct: 60, lastOutput: '' },
  { id: 'cs', name: 'Customer Success Agent', icon: '👥', role: 'Retention & Churn Intelligence', status: 'idle', task: 'Standby', pct: 0, humanPct: 55, agentPct: 45, lastOutput: '' },
]

/* ─── AGENT TASK OUTPUTS ─── */
const AGENT_OUTPUTS = {
  'pre-4': { agentId: 'research', output: 'TAM Analysis Complete:\nTAM: ₹4,200 Cr\nSAM: ₹840 Cr\nSOM: ₹180 Cr\n\n47 competitors scanned. No dominant player in Indian CA-firm segment.\nICP confirmed: CA firms 5–25 staff, 6+ yrs, 30+ GST clients.\n\nRecommendation: Market is large and fragmented — proceed.' },
  'val-3': { agentId: 'validation', output: 'PMF Score: 7.8/10\nSprint 1: 15 interviews, 4 paid commits, CVR 24%\nD7 retention: 62% (target 70%+)\nSegment: CA firms 5–25 staff confirmed\n\nRecommendation: Conditional proceed — fix D7 retention before filing SPICe+' },
  'val-6': { agentId: 'validation', output: 'PMF Scorecard v2:\nCVR: 24% ✓\nInterview confirmation: 9/15 ✓\nPre-sells: 4 ✓\nD7 retention: 62% ⚠ (target 70%+)\n\nUpdated PMF Score: 7.8/10\nVerdict: CONDITIONAL PROCEED\nCondition: Improve D7 retention to 70%' },
  'inc-2': { agentId: 'compliance', output: 'Name search complete:\n"[Company Name] Pvt Ltd" — AVAILABLE\nMCA registry: No conflicts\nTrademark database: No conflicts\n\nRecommendation: File name reservation immediately.' },
  'inc-4': { agentId: 'compliance', output: 'SPICe+ Part B prepared:\n✓ Company registration\n✓ DIN for both directors\n✓ PAN application\n✓ TAN application\n✓ EPFO registration\n✓ ESIC registration\n\nReady to submit. Estimated COI: 12–15 working days.' },
  'inc-6': { agentId: 'compliance', output: 'INC-20A drafted and ready.\nFiling window: Within 180 days of COI (target: 30 days)\nPenalty if missed: ₹50,000 + ₹1,000/day\n\nCalendar reminder set. Auto-file queued.' },
  'setup-2': { agentId: 'compliance', output: 'GST Registration initiated:\nGSTIN application submitted\nEstimated approval: 7–10 working days\nFirst return due: 45 days post-registration\n\nMonthly filing reminders set.' },
  'setup-3': { agentId: 'compliance', output: 'Trademark filing initiated:\nClasses: 9, 35, 42 (SaaS)\nApplication submitted\nTM symbol usable immediately\nFull registration: 18–24 months' },
  'ops-4': { agentId: 'validation', output: 'Channel Analysis:\nLinkedIn CAC: ₹420 (target ₹680 — 38% below)\nConversion: 3.2% of demos to paid\nLTV:CAC ratio: 6.8:1\n\nVerdict: LinkedIn is your scalable channel.\nRecommendation: 2× budget after churn < 5%.' },
}

/* ─── TASK ELIGIBLE ASSIGNEES ─── */
export const TASK_ELIGIBLE_ASSIGNEES = {
  // ── PRE-INCORPORATION ──
  'pre-1': { humans: ['founder'], agents: [], locked: true, reason: 'Problem definition requires founder conviction. Cannot be delegated.' },
  'pre-2': { humans: ['founder', 'cofounder', 'advisor'], agents: ['research'], locked: false, agentNote: 'Research Agent can suggest ICP based on market scan — founder must validate.' },
  'pre-3': { humans: ['founder'], agents: [], locked: true, reason: 'Founder-market fit is a self-assessment. Only you can answer this.' },
  'pre-4': { humans: ['founder', 'advisor'], agents: ['research'], locked: false, recommended: 'research', agentNote: 'Research Agent generates a bottom-up TAM model across 3 scenarios in under 3 minutes.' },
  'pre-5': { humans: ['founder', 'cofounder'], agents: ['compliance'], locked: false, recommended: 'compliance', agentNote: 'Compliance Agent drafts the agreement template. Founder must sign.' },

  // ── VALIDATION ──
  'val-1': { humans: ['founder'], agents: [], locked: true, reason: 'Hypothesis must come from the founder. It defines the direction of the company.' },
  'val-2': { humans: ['founder', 'cofounder'], agents: [], locked: false, humanNote: 'Customers open up differently with founders. Do not delegate to an agent or advisor.' },
  'val-3': { humans: ['founder'], agents: ['validation'], locked: false, recommended: 'validation', agentNote: 'Validation Agent synthesises interview transcripts and calculates PMF score.' },
  'val-4': { humans: ['founder', 'cofounder', 'advisor'], agents: ['cs', 'validation'], locked: false, humanNote: 'Founder calls have 3× retention rate. CS Agent can identify at-risk accounts.' },
  'val-5': { humans: ['founder', 'cofounder'], agents: [], locked: false, humanNote: 'Pre-sells at this stage require founder credibility.' },
  'val-6': { humans: ['founder'], agents: ['validation'], locked: false, recommended: 'validation', agentNote: 'Validation Agent runs the final PMF scorecard across all signals.' },

  // ── INCORPORATION ──
  'inc-1': { humans: ['founder', 'advisor', 'ca'], agents: ['compliance'], locked: false, humanNote: 'CA or legal advisor should validate the choice. Compliance Agent can brief you.' },
  'inc-2': { humans: ['founder'], agents: ['compliance'], locked: false, recommended: 'compliance', agentNote: 'Compliance Agent runs MCA + trademark search and prepares 3 name options.' },
  'inc-3': { humans: ['founder', 'cofounder'], agents: [], locked: false, humanNote: 'Requires physical presence. Cannot be done by an agent.' },
  'inc-4': { humans: ['founder', 'ca'], agents: ['compliance'], locked: false, recommended: 'compliance', agentNote: 'Compliance Agent handles all 8 fields of SPICe+ Part B filing.' },
  'inc-5': { humans: ['founder', 'cofounder'], agents: [], locked: false, humanNote: 'Requires founder presence at the bank. Agent cannot substitute.' },
  'inc-6': { humans: ['founder', 'ca'], agents: ['compliance'], locked: false, recommended: 'compliance', agentNote: 'Compliance Agent files INC-20A and sets 30-day reminder.' },

  // ── SETUP ──
  'setup-1': { humans: ['founder', 'ca', 'advisor'], agents: ['finance'], locked: false, recommended: 'finance', agentNote: 'Finance Agent configures chart of accounts and connects bank feed.' },
  'setup-2': { humans: ['founder', 'ca'], agents: ['compliance'], locked: false, recommended: 'compliance', agentNote: 'Compliance Agent submits GST application and tracks approval.' },
  'setup-3': { humans: ['founder', 'ca'], agents: ['compliance'], locked: false, recommended: 'compliance', agentNote: 'Compliance Agent files in Classes 9, 35, 42 for SaaS.' },
  'setup-4': { humans: ['founder', 'cofounder', 'ca', 'advisor'], agents: ['compliance'], locked: false, agentNote: 'Compliance Agent generates agreement templates with IP assignment clause.' },

  // ── EARLY OPERATIONS ──
  'ops-1': { humans: ['founder'], agents: [], locked: true, reason: 'First 10 customers must be founder-closed. These conversations define your product.' },
  'ops-2': { humans: ['founder', 'cofounder'], agents: [], locked: true, reason: 'The playbook must be written by whoever closed the deals. That is you.' },
  'ops-3': { humans: ['founder', 'cofounder', 'advisor'], agents: ['cs'], locked: false, humanNote: 'Founder calls have 3× retention rate. CS Agent identifies root cause.' },
  'ops-4': { humans: ['founder', 'cofounder'], agents: ['validation'], locked: false, recommended: 'validation', agentNote: 'Validation Agent analyses channel CAC:LTV and recommends the scalable one.' },

  // ── GROWTH ──
  'growth-1': { humans: ['founder', 'advisor', 'ca'], agents: ['finance', 'compliance'], locked: false, recommended: 'finance', agentNote: 'Finance Agent assembles data room: cohort retention, unit economics, cap table.' },
  'growth-2': { humans: ['founder'], agents: [], locked: true, reason: 'Fundraising is a founder relationship. Investors back people, not agents.' },
  'growth-3': { humans: ['founder', 'cofounder'], agents: [], locked: true, reason: 'Leadership hiring defines company culture. Founder must own these decisions.' },

  // ── EXIT ──
  'exit-1': { humans: ['founder', 'advisor', 'ca'], agents: ['compliance', 'finance'], locked: false, humanNote: 'M&A advisor should lead this. Compliance and Finance Agents prepare documentation.' },
  'exit-2': { humans: ['founder', 'advisor'], agents: [], locked: true, reason: 'LOI negotiation requires founder authority. Advisors can support but not substitute.' },
}

// Infer a role ID from a free-text role string
function inferRoleId(role) {
  if (!role) return 'human'
  const r = role.toLowerCase()
  if (r.includes('co-found') || r.includes('cofounder')) return 'cofounder'
  if (r.includes('advisor') || r.includes('mentor')) return 'advisor'
  if (r.includes('ca') || r.includes('chartered') || r.includes('legal') || r.includes('lawyer')) return 'ca'
  if (r.includes('cto') || r.includes('engineer') || r.includes('tech')) return 'engineer'
  if (r.includes('design')) return 'designer'
  if (r.includes('sales') || r.includes('growth') || r.includes('marketing')) return 'sales'
  return 'human'
}

export function getEligibleAssignees(taskId, companyTeam = [], companyAgents = []) {
  const rule = TASK_ELIGIBLE_ASSIGNEES[taskId]
  if (!rule) {
    return { humans: companyTeam, agents: companyAgents, locked: false, recommended: null, reason: null, humanNote: null, agentNote: null }
  }
  const eligibleHumans = companyTeam.filter(member => {
    if (member.isFounder) return rule.humans.includes('founder')
    const roleId = member.roleId || inferRoleId(member.role)
    return rule.humans.includes(roleId) || rule.humans.includes(member.type?.toLowerCase())
  })
  const eligibleAgents = companyAgents.filter(agent => rule.agents.includes(agent.id))
  return {
    humans: eligibleHumans,
    agents: eligibleAgents,
    locked: rule.locked || false,
    recommended: rule.recommended || null,
    reason: rule.reason || null,
    humanNote: rule.humanNote || null,
    agentNote: rule.agentNote || null,
  }
}

/* ─── HISTORY ENTRIES ─── */
const INITIAL_HISTORY = []

/* ─── COMPUTE CONFIDENCE ─── */
function computeConfidence(stages, agents, founderExp) {
  // Base from founder experience
  const expBase = founderExp === 'expert' ? 12 : founderExp === 'some' ? 8 : 4
  const allTasks = stages.flatMap(s => s.tasks)
  const done = allTasks.filter(t => t.status === 'done').length
  const total = allTasks.length
  const completion = total > 0 ? (done / total) * 40 : 0
  const scored = allTasks.filter(t => t.score != null)
  const avgScore = scored.length > 0 ? scored.reduce((a, t) => a + t.score, 0) / scored.length : 0
  const quality = (avgScore / 10) * 40
  const agentBonus = agents.filter(a => a.status === 'completed').length * 3
  return Math.min(100, Math.round(expBase + completion + quality + agentBonus))
}

export const useStore = create((set, get) => ({
  /* ── Navigation ── */
  page: 'operating',

  /* ── Theme ── */
  theme: 'dark',

  /* ── Onboarding ── */
  onboarded: false,
  startup: { name: '', industry: '', founderExp: '' },

  /* ── Core data ── */
  stages: INITIAL_STAGES,
  agents: INITIAL_AGENTS,
  history: INITIAL_HISTORY,

  /* ── Financials ── */
  financials: {
    monthlyBurn: 0, revenue: 0, cashInBank: 0,
    scenarios: { hireEngineer: false, hireSales: false, spendAds: false, hireCS: false },
    history: [],
  },

  /* ── Task agent states ── */
  taskAgentStates: {},
  taskAgentOutputs: {},

  /* ── Signals feed ── */
  signals: [
    { id: 1, type: 'system', text: 'Welcome to Startup OS. Begin with Stage 01: Pre-Incorporation.', time: 'Just now', impact: 0 },
  ],

  /* ─────────────── ACTIONS ─────────────── */

  setPage: (p) => set({ page: p }),

  toggleTheme: () => set(s => {
    const next = s.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.className = next
    return { theme: next }
  }),

  setStartup: (data) => {
    const founderLabel = data.founderExp === 'expert' ? 'domain expert' : data.founderExp === 'some' ? '3–5 years experience' : 'first-time'
    set(s => ({
      startup: data,
      onboarded: true,
      signals: [
        { id: Date.now() + 4, type: 'agent', text: `⚙️ Ops Agent ready — generate your 12-month compliance calendar on the Agents page`, time: 'Just now', impact: 3 },
        { id: Date.now() + 3, type: 'task', text: `📋 Next action: Write your problem statement — one sentence, no solution language`, time: 'Just now', impact: 0 },
        { id: Date.now() + 2, type: 'system', text: `Stage 01: Pre-Incorporation is now active. Complete all tasks to unlock Validation.`, time: 'Just now', impact: 0 },
        { id: Date.now() + 1, type: 'milestone', text: `🚀 ${data.name} initialized — ${data.industry} startup, ${founderLabel} founder`, time: 'Just now', impact: 5 },
        ...s.signals,
      ],
      history: [
        { id: Date.now(), type: 'Stage', text: `${data.name} created. Stage 01: Pre-Incorporation is now active.`, stage: 'Pre-Inc', time: 'Just now', impact: '+5%' },
        ...s.history,
      ],
    }))
  },

  /* ── Signals ── */
  addSignal: (text, type = 'task', impact = 0) => set(s => ({
    signals: [{ id: Date.now() + Math.random(), type, text, time: 'Just now', impact }, ...s.signals.slice(0, 49)],
  })),

  addHistory: (entry) => set(s => ({
    history: [{ id: Date.now(), ...entry, time: 'Just now' }, ...s.history],
  })),

  /* ── Task: reassign ── */
  reassignTask: (stageId, taskId, newOwner, ownerType) => {
    // ownerType: 'Founder' or 'Agent'
    set(s => ({
      stages: s.stages.map(st =>
        st.id !== stageId ? st : {
          ...st,
          tasks: st.tasks.map(t =>
            t.id !== taskId ? t : { ...t, owner: ownerType, assignedTo: newOwner }
          ),
        }
      ),
    }))
    get().addSignal(`📋 "${get().stages.find(s => s.id === stageId)?.tasks.find(t => t.id === taskId)?.title}" reassigned to ${newOwner}`, 'task', 0)
  },

  /* ── Task: complete ── */
  completeTask: (stageId, taskId) => {
    const { stages, agents, addSignal, addHistory } = get()
    const task = stages.find(s => s.id === stageId)?.tasks.find(t => t.id === taskId)
    if (!task || task.status === 'done') return

    set(s => {
      const newStages = s.stages.map(st => {
        if (st.id !== stageId) return st
        const tasks = st.tasks.map(t => t.id === taskId ? { ...t, status: 'done' } : t)
        const doneTasks = tasks.filter(t => t.status === 'done').length
        const totalTasks = tasks.length
        const pct = Math.round((doneTasks / totalTasks) * 100)
        const allDone = tasks.every(t => t.status === 'done')
        const scored = tasks.filter(t => t.score != null)
        const avg = scored.length > 0 ? scored.reduce((a, t) => a + t.score, 0) / scored.length : 10
        let status = st.status
        if (allDone && avg >= 7) status = 'completed'
        return { ...st, tasks, status, pct }
      })
      // unlock next stage + add completion signal
      const idx = newStages.findIndex(st => st.id === stageId)
      if (idx >= 0 && newStages[idx].status === 'completed' && idx + 1 < newStages.length) {
        const completedName = newStages[idx].name
        const nextName = newStages[idx + 1].name
        newStages[idx + 1] = { ...newStages[idx + 1], status: 'active' }
        // Defer the signal so it fires after set()
        setTimeout(() => {
          const { addSignal: sig, addHistory: hist } = get()
          sig(`🎉 Stage ${completedName} complete! ${nextName} is now unlocked.`, 'milestone', 5)
          hist({ type: 'Stage', text: `Stage transition: ${completedName} → ${nextName}`, stage: completedName, impact: '+5%' })
        }, 0)
      }
      return { stages: newStages }
    })
    addSignal(`✅ "${task.title}" completed`, 'task', 2)
    addHistory({ type: 'Task', text: `"${task.title}" completed`, stage: stageId, impact: '+2%' })
  },

  /* ── Task: set output ── */
  setTaskOutput: (stageId, taskId, output) => set(s => ({
    stages: s.stages.map(st =>
      st.id !== stageId ? st : {
        ...st,
        tasks: st.tasks.map(t =>
          t.id !== taskId ? t : { ...t, output, status: output ? 'in-progress' : t.status }
        ),
      }
    ),
  })),

  /* ── Task: evaluate ── */
  evaluateTask: (stageId, taskId) => {
    const { stages, addSignal } = get()
    const task = stages.find(s => s.id === stageId)?.tasks.find(t => t.id === taskId)
    if (!task?.output) return null
    const words = task.output.split(/\s+/).filter(Boolean).length
    const hasNum = /\d/.test(task.output)
    const len = task.output.length
    let score = 2
    if (words >= 15) score += 2
    if (words >= 30) score += 1
    if (hasNum) score += 2
    if (len > 60) score += 1
    if (len > 120) score += 1
    score = Math.min(10, score)
    const strengths = [hasNum && 'Includes specific numbers', words >= 20 && 'Sufficient detail', len > 80 && 'Well-documented'].filter(Boolean)
    const gaps = [!hasNum && 'Add quantified metrics', words < 15 && 'Expand with more context'].filter(Boolean)
    const feedback = { score, strengths, gaps }
    set(s => ({
      stages: s.stages.map(st =>
        st.id !== stageId ? st : {
          ...st,
          tasks: st.tasks.map(t =>
            t.id !== taskId ? t : { ...t, score, feedback, status: 'in-progress', evaluatedAt: new Date().toISOString() }
          ),
        }
      ),
    }))
    addSignal(`◆ "${task.title}" scored ${score}/10`, 'task', score >= 7 ? 2 : -1)
    return feedback
  },

  /* ── Task: run agent ── */
  runTaskAgent: async (stageId, taskId) => {
    const { stages, addSignal } = get()
    const task = stages.find(s => s.id === stageId)?.tasks.find(t => t.id === taskId)
    if (!task) return
    set(s => ({ taskAgentStates: { ...s.taskAgentStates, [taskId]: 'running' } }))
    addSignal(`🤖 Agent started: "${task.title}"`, 'agent', 0)
    await new Promise(r => setTimeout(r, 2400))
    const agentOut = AGENT_OUTPUTS[taskId]
    const output = agentOut?.output || `Agent analysis complete for "${task.title}". Output based on current context.`
    set(s => ({
      taskAgentStates: { ...s.taskAgentStates, [taskId]: 'done' },
      taskAgentOutputs: { ...s.taskAgentOutputs, [taskId]: { output } },
    }))
    addSignal(`✨ Agent completed: "${task.title}"`, 'agent', 2)
  },

  acceptAgentOutput: (stageId, taskId) => {
    const { taskAgentOutputs, setTaskOutput } = get()
    const out = taskAgentOutputs[taskId]
    if (!out) return
    setTaskOutput(stageId, taskId, out.output)
    set(s => ({ taskAgentStates: { ...s.taskAgentStates, [taskId]: 'accepted' } }))
  },

  dismissAgentOutput: (taskId) => set(s => ({
    taskAgentStates: { ...s.taskAgentStates, [taskId]: 'idle' },
    taskAgentOutputs: { ...s.taskAgentOutputs, [taskId]: null },
  })),

  /* ── Agents page: trigger ── */
  triggerAgent: async (agentId) => {
    const { agents, addSignal } = get()
    const agent = agents.find(a => a.id === agentId)
    if (!agent || agent.status === 'running') return
    set(s => ({ agents: s.agents.map(a => a.id === agentId ? { ...a, status: 'running', pct: 10 } : a) }))
    addSignal(`🤖 ${agent.name} started`, 'agent', 0)
    // simulate progress
    for (let p = 20; p <= 90; p += 20) {
      await new Promise(r => setTimeout(r, 500))
      set(s => ({ agents: s.agents.map(a => a.id === agentId ? { ...a, pct: p } : a) }))
    }
    await new Promise(r => setTimeout(r, 600))
    set(s => ({ agents: s.agents.map(a => a.id === agentId ? { ...a, status: 'completed', pct: 100 } : a) }))
    addSignal(`✨ ${agent.name} completed`, 'agent', 3)
  },

  resetAgent: (agentId) => set(s => ({
    agents: s.agents.map(a => a.id === agentId ? { ...a, status: 'idle', pct: 0 } : a),
  })),

  /* ── Financials ── */
  toggleScenario: (key) => set(s => ({
    financials: { ...s.financials, scenarios: { ...s.financials.scenarios, [key]: !s.financials.scenarios[key] } },
  })),

  updateFinancials: (data) => set(s => {
    const updated = { ...s.financials, ...data }
    return {
      financials: {
        ...updated,
        history: [...s.financials.history, { month: `M${s.financials.history.length + 1}`, burn: updated.monthlyBurn, revenue: updated.revenue }].slice(-8),
      },
    }
  }),

  /* ── Primary action ── */
  executePrimaryAction: (stageId) => {
    const { stages, addSignal, addHistory } = get()
    const stage = stages.find(s => s.id === stageId)
    if (!stage) return
    addSignal(`▶ Action taken: "${stage.decision}"`, 'milestone', 3)
    addHistory({ type: 'Decision', text: `Primary action on ${stage.name}: "${stage.decision}"`, stage: stageId, impact: '+3%' })
    // Update pct slightly
    set(s => ({
      stages: s.stages.map(st => st.id !== stageId ? st : { ...st, pct: Math.min(st.pct + 10, 100) }),
    }))
  },

  /* ── Reset ── */
  resetAll: () => {
    document.documentElement.className = 'dark'
    set({
      stages: INITIAL_STAGES, agents: INITIAL_AGENTS, history: INITIAL_HISTORY,
      taskAgentStates: {}, taskAgentOutputs: {}, theme: 'dark', page: 'operating', onboarded: false,
      startup: { name: '', industry: '', founderExp: '' },
      financials: { monthlyBurn: 0, revenue: 0, cashInBank: 0, scenarios: { hireEngineer: false, hireSales: false, spendAds: false, hireCS: false }, history: [] },
      signals: [{ id: 1, type: 'system', text: 'Welcome to Startup OS. Begin with Stage 01: Pre-Incorporation.', time: 'Just now', impact: 0 }],
    })
  },

  /* ── Derived ── */
  getConfidence: () => {
    const { stages, agents, startup } = get()
    return computeConfidence(stages, agents, startup.founderExp)
  },
}))
