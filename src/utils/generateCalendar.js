import { MONTHLY_EVENTS, QUARTERLY_EVENTS, ANNUAL_EVENTS, ONE_TIME_EVENTS } from '../data/complianceRules'

export function generateComplianceCalendar(params) {
  const { incorporationDate, hasGST = true, employeeCount = 2, state = 'Tamil Nadu', companyName = 'Your Company' } = params
  const incDate = new Date(incorporationDate)
  const today = new Date()
  const endDate = new Date(today)
  endDate.setMonth(endDate.getMonth() + 12)
  const events = []

  // Monthly events
  for (let m = 0; m < 13; m++) {
    const refDate = new Date(today.getFullYear(), today.getMonth() + m, 1)
    MONTHLY_EVENTS.forEach(event => {
      if (event.requires === 'gst' && !hasGST) return
      if (event.requires === 'employees' && employeeCount < 10) return
      const dueDate = new Date(refDate.getFullYear(), refDate.getMonth(), event.dayOfMonth)
      if (dueDate >= today && dueDate <= endDate) {
        events.push({ ...event, dueDate, dueDateStr: formatDate(dueDate), monthLabel: monthLabel(dueDate), urgency: getUrgency(dueDate, today) })
      }
    })
  }

  // Quarterly events
  const currentYear = today.getFullYear()
  ;[currentYear, currentYear + 1].forEach(year => {
    QUARTERLY_EVENTS.forEach(event => {
      const y = event.dueDate.nextYear ? year + 1 : year
      const dueDate = new Date(y, event.dueDate.month - 1, event.dueDate.day)
      if (dueDate >= today && dueDate <= endDate) {
        events.push({ ...event, dueDate, dueDateStr: formatDate(dueDate), monthLabel: monthLabel(dueDate), urgency: getUrgency(dueDate, today) })
      }
    })
  })

  // Annual events
  ;[currentYear, currentYear + 1].forEach(year => {
    ANNUAL_EVENTS.forEach(event => {
      if (event.requires === 'employees' && employeeCount < 1) return
      const dueDate = new Date(year, event.dueDate.month - 1, event.dueDate.day)
      if (dueDate >= today && dueDate <= endDate) {
        events.push({ ...event, dueDate, dueDateStr: formatDate(dueDate), monthLabel: monthLabel(dueDate), urgency: getUrgency(dueDate, today) })
      }
    })
  })

  // One-time events
  ONE_TIME_EVENTS.forEach(event => {
    if (event.requires === 'employees_20' && employeeCount < 20) return
    if (event.requires === 'employees_10' && employeeCount < 10) return
    if (event.daysFromIncorporation !== null) {
      const dueDate = new Date(incDate)
      dueDate.setDate(dueDate.getDate() + event.daysFromIncorporation)
      if (dueDate >= today && dueDate <= endDate) {
        events.push({ ...event, dueDate, dueDateStr: formatDate(dueDate), monthLabel: monthLabel(dueDate), urgency: getUrgency(dueDate, today), isOneTime: true })
      }
    }
  })

  events.sort((a, b) => a.dueDate - b.dueDate)

  const grouped = {}
  events.forEach(e => {
    if (!grouped[e.monthLabel]) grouped[e.monthLabel] = []
    grouped[e.monthLabel].push(e)
  })

  return { events, grouped, companyName, generatedOn: formatDate(today), state }
}

function formatDate(date) {
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function monthLabel(date) {
  return date.toLocaleString('en-IN', { month: 'long', year: 'numeric' })
}

function getUrgency(dueDate, today) {
  const days = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
  if (days <= 7) return 'critical'
  if (days <= 21) return 'urgent'
  if (days <= 45) return 'upcoming'
  return 'planned'
}

export function getDaysUntil(dueDate) {
  return Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24))
}
