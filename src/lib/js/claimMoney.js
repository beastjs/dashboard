const a = (s) => Math.round((Number(s) || 0) * 100) / 100,
  u = (s) =>
    s == null || s === '' || isNaN(Number(s))
      ? '₱0.00'
      : '₱' + Number(s).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  r = (s) => a((s || []).reduce((e, m) => e + (Number(m.amount_claimed) || 0), 0)),
  t = (s) => a((s || []).reduce((e, m) => e + (Number(m.amount_assessed) || 0), 0))
export { t as a, u as p, a as r, r as s }
