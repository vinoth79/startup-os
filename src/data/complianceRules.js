export const COMPLIANCE_CATEGORIES = {
  GST: { label: 'GST', color: '#2563EB', requires: 'gst' },
  TDS: { label: 'TDS / Income Tax', color: '#7C3AED', requires: null },
  ROC: { label: 'MCA / ROC', color: '#0F766E', requires: null },
  PF: { label: 'PF / ESI', color: '#B45309', requires: 'employees' },
  ADVANCE_TAX: { label: 'Advance Tax', color: '#DC2626', requires: null },
  ONE_TIME: { label: 'One-Time (Critical)', color: '#1E40AF', requires: null },
  ANNUAL: { label: 'Annual Compliance', color: '#15803D', requires: null },
}

export const MONTHLY_EVENTS = [
  { id: 'gstr1', title: 'GSTR-1 Filing', description: 'File outward supply details for the previous month', dayOfMonth: 11, category: 'GST', penalty: '₹50/day up to ₹5,000', requires: 'gst', form: 'GSTR-1', portal: 'GST Portal (gst.gov.in)' },
  { id: 'gstr3b', title: 'GSTR-3B Filing', description: 'File monthly summary return and pay GST liability', dayOfMonth: 20, category: 'GST', penalty: '₹50/day + 18% interest on tax due', requires: 'gst', form: 'GSTR-3B', portal: 'GST Portal (gst.gov.in)' },
  { id: 'tds_payment', title: 'TDS Payment', description: 'Deposit TDS deducted in previous month to government', dayOfMonth: 7, category: 'TDS', penalty: '1.5% per month interest + ₹200/day late fee', requires: null, form: 'Challan ITNS 281', portal: 'Income Tax Portal (incometax.gov.in)' },
  { id: 'pf_payment', title: 'PF & ESI Payment', description: 'Deposit provident fund and ESI contributions for previous month', dayOfMonth: 15, category: 'PF', penalty: '12% p.a. interest + damages up to 25% of arrears', requires: 'employees', form: 'ECR', portal: 'EPFO Unified Portal' },
]

export const QUARTERLY_EVENTS = [
  { id: 'tds_return_q1', title: 'TDS Return — Q1 (Apr–Jun)', description: 'File quarterly TDS return for salary and non-salary payments', dueDate: { month: 7, day: 31 }, category: 'TDS', penalty: '₹200/day up to tax deducted amount', form: 'Form 24Q / 26Q', portal: 'TRACES Portal' },
  { id: 'tds_return_q2', title: 'TDS Return — Q2 (Jul–Sep)', description: 'File quarterly TDS return', dueDate: { month: 10, day: 31 }, category: 'TDS', penalty: '₹200/day up to tax deducted amount', form: 'Form 24Q / 26Q', portal: 'TRACES Portal' },
  { id: 'tds_return_q3', title: 'TDS Return — Q3 (Oct–Dec)', description: 'File quarterly TDS return', dueDate: { month: 1, day: 31, nextYear: true }, category: 'TDS', penalty: '₹200/day up to tax deducted amount', form: 'Form 24Q / 26Q', portal: 'TRACES Portal' },
  { id: 'tds_return_q4', title: 'TDS Return — Q4 (Jan–Mar)', description: 'File quarterly TDS return', dueDate: { month: 5, day: 31 }, category: 'TDS', penalty: '₹200/day up to tax deducted amount', form: 'Form 24Q / 26Q', portal: 'TRACES Portal' },
  { id: 'advance_tax_q1', title: 'Advance Tax — 1st Instalment', description: 'Pay 15% of estimated annual tax liability', dueDate: { month: 6, day: 15 }, category: 'ADVANCE_TAX', penalty: '1% per month interest on shortfall', form: 'Challan ITNS 280', portal: 'Income Tax Portal' },
  { id: 'advance_tax_q2', title: 'Advance Tax — 2nd Instalment', description: 'Pay cumulative 45% of estimated annual tax liability', dueDate: { month: 9, day: 15 }, category: 'ADVANCE_TAX', penalty: '1% per month interest on shortfall', form: 'Challan ITNS 280', portal: 'Income Tax Portal' },
  { id: 'advance_tax_q3', title: 'Advance Tax — 3rd Instalment', description: 'Pay cumulative 75% of estimated annual tax liability', dueDate: { month: 12, day: 15 }, category: 'ADVANCE_TAX', penalty: '1% per month interest on shortfall', form: 'Challan ITNS 280', portal: 'Income Tax Portal' },
  { id: 'advance_tax_q4', title: 'Advance Tax — 4th Instalment', description: 'Pay 100% of estimated annual tax liability', dueDate: { month: 3, day: 15 }, category: 'ADVANCE_TAX', penalty: '1% per month interest on shortfall', form: 'Challan ITNS 280', portal: 'Income Tax Portal' },
]

export const ANNUAL_EVENTS = [
  { id: 'agm', title: 'Annual General Meeting (AGM)', description: 'Hold AGM within 6 months of financial year end. First AGM: within 9 months of incorporation.', dueDate: { month: 9, day: 30 }, category: 'ROC', penalty: '₹1,00,000 company + ₹1,00,000 each director', form: 'MGT-15', portal: 'MCA Portal (mca.gov.in)' },
  { id: 'aoc4', title: 'AOC-4 — Financial Statements Filing', description: 'File audited financial statements with ROC within 30 days of AGM', dueDate: { month: 10, day: 30 }, category: 'ROC', penalty: '₹100/day per form', form: 'AOC-4 / AOC-4 XBRL', portal: 'MCA V3 Portal' },
  { id: 'mgt7', title: 'MGT-7 — Annual Return Filing', description: 'File annual return with ROC within 60 days of AGM', dueDate: { month: 11, day: 29 }, category: 'ROC', penalty: '₹100/day per form — no maximum cap', form: 'MGT-7 / MGT-7A', portal: 'MCA V3 Portal' },
  { id: 'itr', title: 'Income Tax Return (ITR)', description: 'File corporate income tax return. Audit cases: October 31. Others: July 31.', dueDate: { month: 10, day: 31 }, category: 'TDS', penalty: '₹5,000 (before Dec 31) / ₹10,000 (after) + interest', form: 'ITR-6', portal: 'Income Tax Portal' },
  { id: 'dir3kyc', title: 'DIR-3 KYC — Director KYC', description: 'Annual KYC filing for all directors. Mandatory for every director with a DIN.', dueDate: { month: 9, day: 30 }, category: 'ROC', penalty: 'DIN deactivated + ₹5,000 reactivation fee', form: 'DIR-3 KYC', portal: 'MCA V3 Portal' },
  { id: 'statutory_audit', title: 'Statutory Audit Completion', description: 'Appoint auditor and complete statutory audit before AGM.', dueDate: { month: 8, day: 31 }, category: 'ANNUAL', penalty: 'Cannot hold AGM or file financials without audit.', form: 'ADT-1', portal: 'MCA V3 Portal' },
  { id: 'pf_annual', title: 'PF Annual Return', description: 'File annual PF return for the previous financial year', dueDate: { month: 4, day: 25 }, category: 'PF', penalty: '₹5/day per employee', requires: 'employees', form: 'Form 3A + 6A', portal: 'EPFO Unified Portal' },
]

export const ONE_TIME_EVENTS = [
  { id: 'inc20a', title: '⚠ INC-20A — Commencement of Business', description: 'File within 180 days of COI. CRITICAL: company cannot conduct business until filed.', daysFromIncorporation: 30, legalDeadlineDays: 180, category: 'ONE_TIME', penalty: '₹50,000 company + ₹1,000/day directors. Struck off after 180 days.', form: 'INC-20A', portal: 'MCA V3 Portal', critical: true },
  { id: 'gst_registration', title: 'GST Registration', description: 'Register for GST before first interstate sale or when turnover crosses ₹20L.', daysFromIncorporation: 45, category: 'GST', penalty: '10% of tax due or ₹10,000 (whichever higher)', form: 'GST REG-01', portal: 'GST Portal', conditional: 'Required if interstate sales or turnover > ₹20L/year' },
  { id: 'trademark', title: 'Trademark Filing — Brand + Logo', description: 'File trademark in Classes 9, 35, 42 for SaaS. Use TM symbol immediately after filing.', daysFromIncorporation: 90, category: 'ONE_TIME', penalty: 'No legal penalty but risk of name squatting increases daily', form: 'TM-A', portal: 'IP India (ipindia.gov.in)' },
  { id: 'pf_registration', title: 'PF Registration', description: 'Mandatory when employee count reaches 20.', daysFromIncorporation: null, category: 'PF', penalty: '12% interest + damages 5-25% + prosecution', requires: 'employees_20', form: 'ECR Registration', portal: 'EPFO Unified Portal', conditional: 'Required when employees ≥ 20' },
  { id: 'esic_registration', title: 'ESIC Registration', description: 'Mandatory when employee count reaches 10 (notified areas).', daysFromIncorporation: null, category: 'PF', penalty: 'Simple interest + prosecution', requires: 'employees_10', form: 'ESIC Form', portal: 'ESIC Portal', conditional: 'Required when employees ≥ 10 (notified states)' },
  { id: 'professional_tax', title: 'Professional Tax Registration', description: 'Required in MH, KA, TN, WB, AP, TS.', daysFromIncorporation: 30, category: 'TDS', penalty: 'State-specific — generally 10% of tax due', form: 'State-specific', portal: 'State commercial tax portal', conditional: 'Required in: MH, KA, TN, WB, AP, TS' },
]
