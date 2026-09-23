import { r as a, c as u } from './index-D5.js'
let r = 'PHP',
  s = !1
const c = new Set()
async function i() {
  var e
  if (s) return r
  try {
    const t = await u.entities.FinanceSettings.list('-created_date', 10)
    ;(e = t[0]) != null && e.currency && ((r = t[0].currency), c.forEach((n) => n(r)))
  } catch {}
  return ((s = !0), r)
}
function f(e) {
  !e || e === r || ((r = e), c.forEach((t) => t(e)))
}
function d() {
  const [e, t] = a.useState(r)
  return (
    a.useEffect(
      () => (
        c.add(t),
        i().then(t),
        () => {
          c.delete(t)
        }
      ),
      []
    ),
    e
  )
}
function y(e, t = r) {
  const n = Number(e) || 0
  try {
    return n.toLocaleString(void 0, {
      style: 'currency',
      currency: t,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  } catch {
    return `${t} ${n.toFixed(2)}`
  }
}
const C = [
  'PHP',
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'KRW',
  'AUD',
  'CAD',
  'SGD',
  'HKD',
  'AED',
  'CHF',
  'CNY',
  'INR',
  'THB',
  'MYR',
  'IDR',
  'VND'
]
export { C, y as f, f as s, d as u }
