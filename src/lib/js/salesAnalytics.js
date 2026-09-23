import { c as _ } from './index-D5.js'
import { p as g } from './parseISO.js'
import { e as k, d as v } from './getISOWeek.js'
const f = 200
async function A(c, t) {
  const o = _.entities[c]
  let n = 0
  const s = [],
    e = new Set()
  let i = 0
  for (; i < 500;) {
    i++
    let r
    try {
      r = await o.list(t, f, n)
    } catch {
      break
    }
    if (!r || !r.length) break
    let l = 0
    for (const a of r) a.id && !e.has(a.id) && (e.add(a.id), s.push(a), l++)
    if (r.length < f || l === 0) break
    n += f
  }
  return s
}
const y = (c) =>
  String(c || '')
    .trim()
    .toUpperCase()
function d(c) {
  if (!c) return null
  let t = g(c)
  return (isNaN(t) && (t = new Date(c)), isNaN(t) ? null : `${k(t)}-W${String(v(t)).padStart(2, '0')}`)
}
function O(c, t, o) {
  if (!c) return !1
  const n = String(c).slice(0, 10)
  return !((t && n < t) || (o && n > o))
}
function W(c, t) {
  if (!t) return null
  const o = new Set()
  for (const n of c) {
    if (n.beneficiary_user_name !== t) continue
    const s = y(n.policy_number)
    s && o.add(s)
  }
  return o
}
const h = ['Archived', 'Cancelled']
function C(c, t, o) {
  const n = c.filter((m) => !h.includes(m.record_status)),
    s = n.length,
    e = n.reduce((m, u) => m + (Number(u.total_amount_due) || 0), 0),
    i = t.length,
    r = i > 0 ? s / i : 0,
    l = new Set(o.map((m) => m.beneficiary_user_name).filter(Boolean)).size,
    a = s > 0 ? e / s : 0
  return {
    totalPolicies: s,
    totalPremium: e,
    totalQuotes: i,
    conversion: r,
    activeAgents: l,
    avgPremium: a
  }
}
function F(c, t) {
  const o = {},
    n = (e) =>
      (o[e] = o[e] || {
        week: e,
        policies: 0,
        premium: 0,
        quotes: 0
      })
  for (const e of c) {
    const i = d(e.date_issued)
    i && (n(i).policies++, (o[i].premium += Number(e.total_amount_due) || 0))
  }
  for (const e of t) {
    const i = d(e.created_date)
    i && n(i).quotes++
  }
  const s = Object.values(o).sort((e, i) => e.week.localeCompare(i.week))
  for (const e of s) e.conversion = e.quotes > 0 ? e.policies / e.quotes : 0
  return s
}
function b(c) {
  if (!c) return null
  const t = g(c)
  return isNaN(t) ? null : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}`
}
function M(c, t) {
  const o = {},
    n = (e) =>
      (o[e] = o[e] || {
        month: e,
        policies: 0,
        premium: 0,
        quotes: 0
      })
  for (const e of c) {
    const i = b(e.date_issued)
    i && (n(i).policies++, (o[i].premium += Number(e.total_amount_due) || 0))
  }
  for (const e of t) {
    const i = b(e.created_date)
    i && n(i).quotes++
  }
  const s = Object.values(o).sort((e, i) => e.month.localeCompare(i.month))
  for (const e of s) e.conversion = e.quotes > 0 ? e.policies / e.quotes : 0
  return s
}
function P(c) {
  const t = {}
  for (const o of c) {
    const n = o.beneficiary_user_name || 'Unassigned'
    ;(t[n] ||
      (t[n] = {
        agent: n,
        policies: 0,
        premium: 0,
        commission: 0
      }),
      t[n].policies++,
      (t[n].premium += Number(o.premium_amount) || 0),
      (t[n].commission += Number(o.commission_amount) || Number(o.net_amount) || 0))
  }
  return Object.values(t).sort((o, n) => n.premium - o.premium)
}
function j(c, t) {
  const o = {},
    n = (e) =>
      (o[e] = o[e] || {
        product: e,
        policies: 0,
        premium: 0,
        quotes: 0
      })
  for (const e of c) {
    const i = e.classification || 'Other'
    ;(n(i).policies++, (o[i].premium += Number(e.premium_amount) || 0))
  }
  for (const e of t) {
    const i = e.product_type || 'Other'
    n(i).quotes++
  }
  const s = Object.values(o)
  for (const e of s) e.conversion = e.quotes > 0 ? e.policies / e.quotes : 0
  return s.sort((e, i) => i.premium - e.premium)
}
const w = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
function D(c) {
  const t = [0, 0, 0, 0, 0, 0, 0],
    o = [0, 0, 0, 0, 0, 0, 0]
  for (const n of c) {
    if (!n.date_issued) continue
    const s = new Date(n.date_issued)
    if (isNaN(s)) continue
    const e = s.getDay()
    ;(t[e]++, (o[e] += Number(n.total_amount_due) || 0))
  }
  return w.map((n, s) => ({
    day: n,
    policies: t[s],
    premium: o[s]
  }))
}
function $(c) {
  const t = {},
    o = {}
  for (const n of c) {
    const s = (n.vehicle_make || 'Unknown').trim() || 'Unknown',
      e = (n.vehicle_model || 'Unknown').trim() || 'Unknown'
    ;((t[s] = t[s] || {
      label: s,
      count: 0,
      premium: 0
    }),
      t[s].count++,
      (t[s].premium += Number(n.total_amount_due) || 0))
    const i = `${s} ${e}`
    ;((o[i] = o[i] || {
      label: i,
      make: s,
      model: e,
      count: 0,
      premium: 0
    }),
      o[i].count++,
      (o[i].premium += Number(n.total_amount_due) || 0))
  }
  return {
    makes: Object.values(t).sort((n, s) => s.count - n.count),
    models: Object.values(o).sort((n, s) => s.count - n.count)
  }
}
function x(c, t) {
  const o = c.filter((s) => !h.includes(s.record_status)).length,
    n = c.filter((s) => ['Active', 'Verified', 'Renewed'].includes(s.record_status)).length
  return [
    {
      stage: 'Quotes',
      value: t.length
    },
    {
      stage: 'Issued Policies',
      value: o
    },
    {
      stage: 'Verified / Active',
      value: n
    }
  ]
}
function U({
  kpis: c,
  weekly: t,
  agents: o,
  products: n,
  weekday: s,
  vehicles: e,
  filters: i,
  agentScoped: r,
  hasAgentPolicies: l
}) {
  const a = t.length ? t.reduce((u, p) => (u.policies > p.policies ? u : p)) : null,
    m = t.length ? t.reduce((u, p) => (u.policies < p.policies ? u : p)) : null
  return JSON.stringify({
    scope: {
      from: i.from,
      to: i.to,
      agent: i.agent || null,
      agentScoped: r,
      hasAgentPolicies: l,
      note: r
        ? `Dashboard scoped to agent "${i.agent}" via Commission policy_number join. Conversion = the agent's issued policies ÷ quotes created in the same window (quotes are not agent-attributable).`
        : 'Dashboard shows all agents. Conversion = issued policies ÷ quotes created in the window.'
    },
    kpis: c,
    weekly: t.map((u) => ({
      week: u.week,
      policies: u.policies,
      premium: Math.round(u.premium),
      conversion: +u.conversion.toFixed(3)
    })),
    strongestWeek: a
      ? {
          week: a.week,
          policies: a.policies
        }
      : null,
    weakestWeek: m
      ? {
          week: m.week,
          policies: m.policies
        }
      : null,
    topAgents: o.slice(0, 5).map((u) => ({
      agent: u.agent,
      policies: u.policies,
      premium: Math.round(u.premium)
    })),
    products: n.map((u) => ({
      product: u.product,
      policies: u.policies,
      premium: Math.round(u.premium),
      conversion: +u.conversion.toFixed(3)
    })),
    weekday: s.map((u) => ({
      day: u.day,
      policies: u.policies
    })),
    topMakes: e.makes.slice(0, 5).map((u) => ({
      make: u.label,
      count: u.count
    }))
  })
}
const I = (c) => {
    const t = Number(c || 0),
      o = Math.abs(t)
    return o >= 1e6
      ? '₱' + (t / 1e6).toFixed(2) + 'M'
      : o >= 1e3
        ? '₱' + (t / 1e3).toFixed(2) + 'K'
        : '₱' + t.toFixed(2)
  },
  Y = (c) => (c * 100).toFixed(1) + '%'
function E(c) {
  const t = {}
  for (const s of c) {
    if (!s.date_issued) continue
    const e = String(s.date_issued).slice(0, 4)
    !e || isNaN(+e) || (t[e] = (t[e] || 0) + 1)
  }
  let o = new Date().getFullYear(),
    n = -1
  for (const [s, e] of Object.entries(t)) e > n && ((n = e), (o = +s))
  return {
    from: `${o}-08-01`,
    to: `${o}-12-31`
  }
}
export {
  d as a,
  W as b,
  E as c,
  C as d,
  F as e,
  A as f,
  M as g,
  P as h,
  O as i,
  j,
  D as k,
  $ as l,
  x as m,
  y as n,
  U as o,
  Y as p,
  I as q
}
