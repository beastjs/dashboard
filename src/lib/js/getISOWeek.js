function u(t) {
  const e = Object.prototype.toString.call(t)
  return t instanceof Date || (typeof t == 'object' && e === '[object Date]')
    ? new t.constructor(+t)
    : typeof t == 'number' || e === '[object Number]' || typeof t == 'string' || e === '[object String]'
      ? new Date(t)
      : new Date(NaN)
}
function f(t, e) {
  return t instanceof Date ? new t.constructor(e) : new Date(e)
}
const k = 6048e5,
  b = 864e5,
  g = 6e4,
  I = 36e5
let y = {}
function D() {
  return y
}
function w(t, e) {
  var i, l, O, S
  const n = D(),
    r =
      (e == null ? void 0 : e.weekStartsOn) ??
      ((l = (i = e == null ? void 0 : e.locale) == null ? void 0 : i.options) == null ? void 0 : l.weekStartsOn) ??
      n.weekStartsOn ??
      ((S = (O = n.locale) == null ? void 0 : O.options) == null ? void 0 : S.weekStartsOn) ??
      0,
    s = u(t),
    a = s.getDay(),
    c = (a < r ? 7 : 0) + a - r
  return (s.setDate(s.getDate() - c), s.setHours(0, 0, 0, 0), s)
}
function o(t) {
  return w(t, { weekStartsOn: 1 })
}
function d(t) {
  const e = u(t),
    n = e.getFullYear(),
    r = f(t, 0)
  ;(r.setFullYear(n + 1, 0, 4), r.setHours(0, 0, 0, 0))
  const s = o(r),
    a = f(t, 0)
  ;(a.setFullYear(n, 0, 4), a.setHours(0, 0, 0, 0))
  const c = o(a)
  return e.getTime() >= s.getTime() ? n + 1 : e.getTime() >= c.getTime() ? n : n - 1
}
function Y(t) {
  const e = d(t),
    n = f(t, 0)
  return (n.setFullYear(e, 0, 4), n.setHours(0, 0, 0, 0), o(n))
}
function h(t) {
  const e = u(t),
    n = +o(e) - +Y(e)
  return Math.round(n / k) + 1
}
export { g as a, k as b, f as c, h as d, d as e, b as f, D as g, I as m, w as s, u as t }
