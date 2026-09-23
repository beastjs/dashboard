import { r as a, c as r } from './index-D5.js'
function u() {
  const [l, t] = a.useState(null),
    [c, n] = a.useState(!1)
  a.useEffect(() => {
    let e = !0
    return (
      r.auth
        .me()
        .then((s) => {
          e && t(!!(s != null && s.location_services_enabled))
        })
        .catch(() => {
          e && t(!1)
        }),
      () => {
        e = !1
      }
    )
  }, [])
  const o = a.useCallback(async (e) => {
    n(!0)
    try {
      return (await r.auth.updateMe({ location_services_enabled: e }), t(e), !0)
    } catch {
      return !1
    } finally {
      n(!1)
    }
  }, [])
  return { enabled: l, saving: c, save: o }
}
export { u }
