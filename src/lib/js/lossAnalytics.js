import { n as w, i as h } from './salesAnalytics.js'
import { r } from './claimMoney.js'
import { a as W } from './addDays.js'
import { a as ee } from './addMonths.js'
import { p as S } from './parseISO.js'
import { a as x, d as te } from './addLeadingZeros.js'
import { t as ne } from './getISOWeek.js'
function se(n, t) {
  return ee(n, t * 12)
}
function oe(n, t) {
  const o = ne(n)
  if (isNaN(o.getTime())) throw new RangeError('Invalid time value')
  const l = (t == null ? void 0 : t.format) ?? 'extended'
  let _ = ''
  const d = l === 'extended' ? '-' : ''
  {
    const c = x(o.getDate(), 2),
      y = x(o.getMonth() + 1, 2)
    _ = `${x(o.getFullYear(), 4)}${d}${y}${d}${c}`
  }
  return _
}
function z(n, t) {
  return W(n, -t)
}
function Z(n, t) {
  return se(n, -1)
}
const ae = ['Archived', 'Cancelled'],
  ie = ['Denied'],
  u = (n) => oe(n, {}),
  he = [
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'trailing_12', label: 'Trailing 12 Months' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' }
  ]
function be(n, t = new Date()) {
  const o = t.getFullYear(),
    l = t.getMonth()
  switch (n) {
    case 'this_month':
      return { from: u(new Date(o, l, 1)), to: u(new Date(o, l + 1, 0)) }
    case 'last_month':
      return { from: u(new Date(o, l - 1, 1)), to: u(new Date(o, l, 0)) }
    case 'ytd':
      return { from: u(new Date(o, 0, 1)), to: u(t) }
    default:
      return { from: u(z(t, 364)), to: u(t) }
  }
}
const ve = ({ from: n, to: t }) => {
    const o = S(n),
      l = te(S(t), o)
    return { from: u(z(o, l + 1)), to: u(z(o, 1)) }
  },
  we = ({ from: n, to: t }) => ({ from: u(Z(S(n))), to: u(Z(S(t))) }),
  le = (n) => {
    const t = Number(n.total_amount_assessed) || 0
    return r(t > 0 ? t : Number(n.total_amount_claimed) || 0)
  },
  ce = (n) => n.incident_date || String(n.created_date || '').slice(0, 10),
  q = (n) => {
    const t = Number(n.basic_premium) || 0
    return r(t > 0 ? t : Number(n.total_amount_due) || 0)
  },
  G = (n) => ['Verified', 'Active'].includes(n.policy_status) || !!n.policy_number,
  P = (n, t) => `${(n || '').trim()} ${(t || '').trim()}`.trim() || 'Unknown'
function ge({ policies: n, claims: t, quotes: o, commissions: l = [], users: _ = [] }) {
  const d = {},
    c = {},
    y = new Map(),
    b = {}
  for (const i of l) {
    if (i.source !== 'policy') continue
    const p = w(i.policy_number)
    ;(p && i.classification && (d[p] = i.classification),
      i.beneficiary_user_id && i.beneficiary_user_name && (c[i.beneficiary_user_id] = i.beneficiary_user_name))
  }
  for (const i of _) i != null && i.id && (c[i.id] = i.full_name || i.email || i.id)
  for (const i of n) {
    y.set(i.id, i)
    const p = w(i.policy_number)
    p && (b[p] = i)
  }
  return {
    policies: n,
    claims: t,
    quotes: o,
    commissions: l,
    policyById: y,
    policyByNumber: b,
    classificationByPolicy: d,
    nameByUserId: c
  }
}
function Ie(n, { from: t, to: o, agentPolicySet: l }) {
  const {
      policies: _,
      claims: d,
      quotes: c,
      commissions: y,
      policyById: b,
      policyByNumber: i,
      classificationByPolicy: p,
      nameByUserId: A
    } = n,
    J = (e) => !l || l.has(w(e.policy_number)),
    M = _.filter((e) => !ae.includes(e.record_status) && J(e)),
    g = M.filter((e) => h(e.date_issued, t, o)),
    U = (e) => p[w(e.policy_number)] || (e.own_damage_theft_included ? 'Car Comprehensive' : 'CTPL'),
    I = (e) => ({ label: e, claims: 0, premium: 0, sumInsured: 0 }),
    D = {},
    B = {},
    R = {}
  for (const e of g) {
    const s = (D[U(e)] = D[U(e)] || I(U(e)))
    ;((s.premium += q(e)), (s.sumInsured += Number(e.insured_estimated_vehicle_value) || 0))
    const a = (B[P(e.vehicle_make, e.vehicle_model)] =
      B[P(e.vehicle_make, e.vehicle_model)] || I(P(e.vehicle_make, e.vehicle_model)))
    ;((a.premium += q(e)), (a.sumInsured += Number(e.insured_estimated_vehicle_value) || 0))
  }
  for (const e of y) {
    if (e.source !== 'policy') continue
    const s = e.inception_date || String(e.commission_created_date || '').slice(0, 10)
    if (!h(s, t, o)) continue
    const a = A[e.beneficiary_user_id] || e.beneficiary_user_name || 'Unassigned',
      m = (R[a] = R[a] || I(a))
    m.premium += Number(e.premium_amount) || 0
    const f = i[w(e.policy_number)]
    f && (m.sumInsured += Number(f.insured_estimated_vehicle_value) || 0)
  }
  const F = d.filter((e) => !ie.includes(e.status) && h(ce(e), t, o))
  let N = 0
  for (const e of F) {
    const s = le(e)
    N += s
    const a = e.policy_schedule_id ? b.get(e.policy_schedule_id) : null,
      m = a ? Number(a.insured_estimated_vehicle_value) || 0 : Number(e.sum_insured) || 0,
      f = [D, B, R]
    ;[
      e.product_type || 'Other',
      a ? P(a.vehicle_make, a.vehicle_model) : (e.vehicle_display_name || '').trim() || 'Unknown',
      A[e.created_by_id] || 'Unattributed'
    ].forEach((Y, X) => {
      const Q = (f[X][Y] = f[X][Y] || I(Y))
      ;((Q.claims += s), !a && m && (Q.sumInsured += m))
    })
  }
  const L = (e) =>
      Object.values(e)
        .map((s) => ({
          ...s,
          claims: r(s.claims),
          premium: r(s.premium),
          sumInsured: r(s.sumInsured),
          ratio: s.premium > 0 ? r(s.claims / s.premium) : null,
          severity: s.sumInsured > 0 ? r(s.claims / s.sumInsured) : null
        }))
        .filter((s) => s.claims > 0 || s.premium > 0)
        .sort((s, a) => a.claims - s.claims),
    O = r(g.reduce((e, s) => e + q(s), 0)),
    E = r(g.reduce((e, s) => e + (Number(s.insured_estimated_vehicle_value) || 0), 0)),
    v = c.filter((e) => h(e.created_date, t, o)),
    V = v.filter(G).length,
    T = (e) => {
      const s = {}
      for (const a of v) {
        const m = e(a) || 'Other',
          f = (s[m] = s[m] || { label: m, total: 0, won: 0 })
        ;(f.total++, G(a) && f.won++)
      }
      return Object.values(s)
        .map((a) => ({ ...a, rate: a.total > 0 ? r(a.won / a.total) : null }))
        .sort((a, m) => m.total - a.total)
    },
    j = M.filter((e) => h(e.coverage_end_date, t, o)),
    k = new Set()
  for (const e of j) (e.record_status === 'Renewed' || e.is_renewal) && k.add(e.id)
  for (const e of M) e.is_renewal && h(e.date_issued, t, o) && k.add(e.id)
  const C = j.length,
    $ = k.size,
    K = Math.max(0, C - $)
  return {
    totals: {
      premium: O,
      sumInsured: E,
      claims: r(N),
      policyCount: g.length,
      claimCount: F.length,
      lossRatio: O > 0 ? r(N / O) : null,
      severityRatio: E > 0 ? r(N / E) : null,
      quotes: v.length,
      won: V,
      winRate: v.length > 0 ? r(V / v.length) : null,
      due: C,
      renewed: $,
      lapsed: K,
      renewalRate: C > 0 ? r($ / C) : null
    },
    lossByProduct: L(D),
    lossByVehicle: L(B),
    lossByAgent: L(R),
    winByProduct: T((e) => e.product_type),
    winByAgent: T((e) => A[e.created_by_id] || 'Unattributed'),
    winByBrand: T((e) => (e.vehicle_label || '').trim().split(/\s+/)[0] || 'Other')
  }
}
const H = (n, t) => (n == null || t == null ? null : r((n - t) * 100))
function De(n, t, o, l = 'ratio') {
  const _ = new Map(t.map((c) => [c.label, c[l]])),
    d = new Map(o.map((c) => [c.label, c[l]]))
  return n.map((c) => ({ ...c, momDelta: H(c[l], _.get(c.label)), yoyDelta: H(c[l], d.get(c.label)) }))
}
export { he as P, ve as a, ge as b, Ie as c, H as d, le as e, be as p, De as w, we as y }
