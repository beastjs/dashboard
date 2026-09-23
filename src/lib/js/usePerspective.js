import { aE as m, r as _, c as t } from './index-D5.js'
const v = { agent: '/fastagent', agency: '/fastagency', cardealer: '/fastcardealer', insurer: '/fastinsurer' }
function S() {
  var f
  const e = m(),
    [A, a] = _.useState({ loading: !0 })
  return (
    _.useEffect(() => {
      let s = !0
      return (
        (async () => {
          var c
          try {
            const r = (c = e == null ? void 0 : e.user) != null && c.id ? e.user : await t.auth.me()
            if (!s) return
            if (!r || !r.id) {
              a({ loading: !1, user: null, perspective: null, insurerProfile: null, agentProfile: null, org: null })
              return
            }
            const [g, d, P] = await Promise.all([
              t.entities.FastinsurerProfile.list().catch(() => []),
              t.entities.OrgProfile.list().catch(() => []),
              t.entities.AgentProfile.list().catch(() => [])
            ])
            if (!s) return
            const y = Array.isArray(d) ? d : [],
              p = (Array.isArray(g) ? g : []).find((i) => i.user_id === r.id) || null,
              u = y.find((i) => i.org_admin_user_id === r.id) || null,
              n = (Array.isArray(P) ? P : []).find((i) => i.agent_user_id === r.id) || null
            let l = null,
              o = null
            ;(p
              ? (l = 'insurer')
              : u
                ? ((o = u), (l = u.org_type === 'CarDealer' ? 'cardealer' : 'agency'))
                : n
                  ? ((l = 'agent'), (o = (n.org_id && y.find((i) => i.id === n.org_id)) || null))
                  : r.role === 'admin' && (l = 'agency'),
              a({ loading: !1, user: r, perspective: l, insurerProfile: p, agentProfile: n, org: o }))
          } catch {
            s && a({ loading: !1, user: null, perspective: null, insurerProfile: null, agentProfile: null, org: null })
          }
        })(),
        () => {
          s = !1
        }
      )
    }, [(f = e == null ? void 0 : e.user) == null ? void 0 : f.id]),
    A
  )
}
export { v as P, S as u }
