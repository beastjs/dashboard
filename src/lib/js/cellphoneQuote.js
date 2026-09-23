const y = (e) => '₱' + Number(e || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  D = (e) => '₱' + Number(e || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  C = (e) => (Number(e || 0) * 100).toFixed(4).replace(/\.?0+$/, '') + '%',
  P = (e) => {
    if (!e) return '—'
    const t = new Date(e)
    return isNaN(t) ? '—' : t.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: '2-digit' })
  },
  S = (e) => {
    if (!e) return '—'
    const t = new Date(e)
    return isNaN(t)
      ? '—'
      : t.toLocaleString('en-PH', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
  }
function f(e) {
  const t = Number(e) || 0
  return Math.round((t + Number.EPSILON) * 100) / 100
}
const d = () => new Date().toISOString().slice(0, 10)
function v(e, t) {
  const a = t || d()
  return !(
    e.status !== 'Active' ||
    e.approval_status !== 'Approved' ||
    (e.effective_from && a < e.effective_from) ||
    (e.effective_to && a > e.effective_to)
  )
}
function p(e, t) {
  const a = Number(t) || 0
  return !((e.min_eligible_fmv && a < e.min_eligible_fmv) || (e.max_eligible_fmv && a > e.max_eligible_fmv))
}
function x(e, t) {
  let a =
    e.rate_method === 'fixed_amount' ? Number(e.coverage_rate || 0) : (Number(t) || 0) * Number(e.coverage_rate || 0)
  return (
    e.min_premium && a < e.min_premium && (a = Number(e.min_premium)),
    e.max_premium && a > e.max_premium && (a = Number(e.max_premium)),
    a
  )
}
function O({ fmv: e, selectedCoverages: t, taxes: a, quoteDate: c }) {
  const s = c || d(),
    o = Number(e) || 0,
    m = []
  let n = 0
  for (const r of t) {
    const g = v(r, s),
      u = p(r, o)
    if (!g || !u) {
      m.push({
        cov: r,
        effective: g,
        eligible: u,
        rate: Number(r.coverage_rate || 0),
        premium: 0,
        method: r.rate_method
      })
      continue
    }
    const N = x(r, o),
      h = f(N)
    ;((n = f(n + h)),
      m.push({
        cov: r,
        effective: !0,
        eligible: !0,
        rate: Number(r.coverage_rate || 0),
        premium: h,
        method: r.rate_method
      }))
  }
  const i = (a || []).filter((r) => v(r, s)),
    _ = []
  let l = 0
  for (const r of i) {
    const g = (r.calculation_basis === 'total_amount_due', n),
      u = f(g * Number(r.tax_rate || 0))
    ;((l = f(l + u)), _.push({ tax: r, rate: Number(r.tax_rate || 0), amount: u }))
  }
  const b = f(n + l)
  return { covLines: m, taxLines: _, totalCoveragePremium: n, totalTaxes: l, totalAmountDue: b, quoteDate: s }
}
function T({ phone: e, fmv: t, selectedCoverages: a, taxes: c, quoteDate: s }) {
  const o = []
  ;(e || o.push('Select a phone variant.'),
    a.length === 0 && o.push('Select at least one coverage.'),
    e && (!e.average_fmv || e.verification_status !== 'Verified') && o.push('The selected phone has no approved FMV.'))
  const m = s || d()
  for (const i of a)
    (v(i, m) || o.push(`Coverage "${i.coverage_name}" has no approved effective rate on the quote date.`),
      Number(i.coverage_rate) < 0 && o.push(`Coverage "${i.coverage_name}" has a negative rate.`),
      p(i, Number(t) || 0) || o.push(`The phone FMV is outside the eligible range for "${i.coverage_name}".`))
  const n = (c || []).filter((i) => v(i, m))
  for (const i of n) Number(i.tax_rate) < 0 && o.push(`Tax "${i.tax_name}" has a negative rate.`)
  return (
    n.length === 0 &&
      (c || []).some((i) => i.status === 'Active') &&
      o.push('No approved effective tax rate found for the quote date.'),
    o
  )
}
const A = [
  { key: 'all', label: 'All Coverages', desc: 'Every active, eligible coverage in the All Coverages package' },
  { key: 'od', label: 'Own Damage Only', desc: 'Own Damage only', code: 'OD' },
  { key: 'th', label: 'Theft Only', desc: 'Theft only', code: 'TH' },
  { key: 'wr', label: 'Warranty Only', desc: 'Warranty only', code: 'WR' },
  { key: 'custom', label: 'Custom Coverage Selection', desc: 'Choose one or more active coverages' }
]
export { A as C, D as a, y as b, O as c, C as d, p as e, P as f, S as g, v as i, f as r, T as v }
