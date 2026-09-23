import { r as s, c as l } from './index-D5.js'
function c(e) {
  if (!e) return 'Other'
  const t = String(e).toLowerCase()
  return t.includes('ctpl')
    ? 'CTPL'
    : t.includes('comprehensive') || t === 'car'
      ? 'Car Comprehensive'
      : t.includes('device') || t.includes('cellphone') || t.includes('phone')
        ? 'Cellphone'
        : t.includes('term life') || t.includes('life')
          ? 'Term Life'
          : t.includes('travel')
            ? 'Travel'
            : 'Other'
}
function a(e, t) {
  let n = '',
    o = '',
    r = ''
  return (
    t === 'quote'
      ? ((n = e.client_name || e.insured_person || ''), (r = e.product_type))
      : t === 'motor' &&
        ((n = e.insured_name_as_printed || [e.insured_first_name, e.insured_last_name].filter(Boolean).join(' ')),
        (o = e.insured_email_address || e.insured_mobile_number || ''),
        (r = e.policy_class || 'Car Comprehensive')),
    { policy_number: e.policy_number, name: n, contact: o, product: c(r), source: t, raw: e }
  )
}
function m() {
  const [e, t] = s.useState([]),
    [n, o] = s.useState(!0)
  return (
    s.useEffect(() => {
      ;(async () => {
        try {
          const [r, u] = await Promise.all([
            l.entities.QuoteRecord.list('-created_date', 500).catch(() => []),
            l.entities.MotorPolicySchedule.list('-created_date', 500).catch(() => [])
          ])
          t([
            ...(r || []).filter((i) => i.policy_number).map((i) => a(i, 'quote')),
            ...(u || []).filter((i) => i.policy_number).map((i) => a(i, 'motor'))
          ])
        } finally {
          o(!1)
        }
      })()
    }, []),
    { records: e, loading: n }
  )
}
export { c as t, m as u }
