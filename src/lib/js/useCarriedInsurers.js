import { r as f, c as d, b0 as p, b7 as h } from './index-D5.js'
const m = { org: "Your organization's accredited insurers", carried: 'The insurers you carry', all: 'All insurers' }
function w(l) {
  const [s, _] = f.useState({ source: 'all', names: null })
  f.useEffect(() => {
    let t = !1
    return (
      (async () => {
        try {
          const r = await d.auth.me()
          if (!(r != null && r.id)) return
          const u = await d.entities.AgentProfile.filter({ agent_user_id: r.id }),
            a = Array.isArray(u) ? u[0] : null
          let n = (a == null ? void 0 : a.org_id) || ''
          if (!n) {
            const e = await d.entities.OrgProfile.list().catch(() => []),
              i = (Array.isArray(e) ? e : []).find((c) => c.org_admin_user_id === r.id)
            i && (n = i.id)
          }
          if (n) {
            const e = await d.entities.OrgInsurerAccreditation.filter({ org_id: n }, 'insurer_name', 500).catch(
                () => []
              ),
              i = (Array.isArray(e) ? e : [])
                .filter((c) => c.active !== !1 && c.insurer_name)
                .map((c) => c.insurer_name)
            if (i.length) {
              t || _({ source: 'org', names: i })
              return
            }
          }
          const o = ((a == null ? void 0 : a.carried_insurer_names) || []).filter(Boolean)
          if (o.length) {
            t || _({ source: 'carried', names: o })
            return
          }
        } catch {}
        t || _({ source: 'all', names: null })
      })(),
      () => {
        t = !0
      }
    )
  }, [])
  const y = f.useMemo(() => {
      const t = p()
      if (s.source === 'all' || !s.names) return t
      const r = l == null ? [] : Array.isArray(l) ? l : [l],
        u = new Set(),
        a = []
      for (const n of [...s.names, ...r]) {
        const o = String(n || '').trim(),
          e = o.toLowerCase()
        !o ||
          u.has(e) ||
          (u.add(e),
          a.push(
            t.find((i) => i.name.toLowerCase() === e) || {
              id: 'usr-' + e.replace(/[^a-z0-9]+/g, '-'),
              name: o,
              category: '',
              license_category: '',
              ownership_type: '',
              key_lines: '',
              contact: '',
              contact_person: '',
              address: '',
              contact_numbers: [],
              email: '',
              logo_url: '',
              quotation_form_url: '',
              policy_schedule_form_url: '',
              travel_quotation_form_url: '',
              travel_policy_schedule_form_url: ''
            }
          ))
      }
      return a.sort((n, o) => n.name.localeCompare(o.name))
    }, [s.source, s.names, l]),
    g = f.useCallback((t) => {
      const r = (t || '').trim()
      r && h(r)
    }, [])
  return {
    insurers: y,
    addInsurer: g,
    source: s.source,
    sourceLabel: m[s.source] || m.all,
    restricted: s.source !== 'all' && !!s.names
  }
}
export { w as u }
