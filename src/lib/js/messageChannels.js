const o = ['WhatsApp', 'Viber', 'Messenger', 'SMS', 'Email'],
  u = (e) => {
    if (!e) return ''
    try {
      return new Date(e).toLocaleString('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    } catch {
      return e
    }
  },
  l = (e) => {
    let n = `Reminder: ${e.title}`
    return (
      e.due_datetime &&
        (n += `
When: ${u(e.due_datetime)}`),
      e.location &&
        (n += `
Where: ${e.location}`),
      e.notes &&
        (n += `
Notes: ${e.notes}`),
      n
    )
  },
  m = (e, n, s) => {
    const r = encodeURIComponent(s)
    if (e === 'WhatsApp') {
      const t = (n.whatsapp || n.phone || '').replace(/[^\d]/g, '')
      return t ? `https://wa.me/${t}?text=${r}` : null
    }
    if (e === 'Viber') {
      const t = (n.viber || n.phone || '').replace(/[^\d]/g, '')
      return t ? `viber://chat?number=%2B${t}` : null
    }
    if (e === 'Messenger') {
      const t = (n.messenger || '').replace(/^@/, '').trim()
      return t ? `https://m.me/${t}` : null
    }
    if (e === 'SMS') {
      const t = (n.phone || '').replace(/[^\d+]/g, '')
      return t ? `sms:${t}?&body=${r}` : null
    }
    if (e === 'Email') {
      const t = (n.email || '').trim()
      if (!t) return null
      const i = encodeURIComponent(
        s
          .split(
            `
`
          )[0]
          .replace(/^Reminder:\s*/, '') || 'Message'
      )
      return `mailto:${t}?subject=${i}&body=${r}`
    }
    return null
  }
export { o as M, m as b, l as d }
