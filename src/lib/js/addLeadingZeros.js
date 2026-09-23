import { t as r, f as u } from './getISOWeek.js'
function a(e) {
  const t = r(e)
  return (t.setHours(0, 0, 0, 0), t)
}
function o(e) {
  const t = r(e),
    n = new Date(
      Date.UTC(
        t.getFullYear(),
        t.getMonth(),
        t.getDate(),
        t.getHours(),
        t.getMinutes(),
        t.getSeconds(),
        t.getMilliseconds()
      )
    )
  return (n.setUTCFullYear(t.getFullYear()), +e - +n)
}
function g(e, t) {
  const n = a(e),
    s = a(t),
    i = +n - o(n),
    c = +s - o(s)
  return Math.round((i - c) / u)
}
function d(e, t) {
  const n = e < 0 ? '-' : '',
    s = Math.abs(e).toString().padStart(t, '0')
  return n + s
}
export { d as a, g as d, a as s }
