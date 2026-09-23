import { r as t, j as e, ah as z, B as N, b as x, ag as C, ai as S, h as k, T as M, c as b } from './index-D5.js'
function w({ onResult: l, disabled: p }) {
  const [E, o] = t.useState(!1),
    [m, u] = t.useState(!1),
    [f, d] = t.useState(''),
    [v, h] = t.useState(!1),
    n = t.useRef(null),
    i = t.useRef(null),
    r = E || m,
    g = async (s) => {
      var I
      const j = (I = s.target.files) == null ? void 0 : I[0]
      if (j) {
        ;(d(''), h(!1), o(!0))
        try {
          const { file_url: y } = await b.integrations.Core.UploadFile({ file: j })
          ;(o(!1), u(!0))
          const c = await b.functions.invoke('verifyImei', { file_url: y }),
            a = (c == null ? void 0 : c.data) ?? c
          a != null && a.found && a != null && a.imei
            ? (h(!0), l == null || l({ ...a, file_url: y }))
            : d('No IMEI detected. Enter it manually or try another photo.')
        } catch {
          d('Scan failed. Please try again or enter the IMEI manually.')
        } finally {
          ;(u(!1), o(!1), n.current && (n.current.value = ''), i.current && (i.current.value = ''))
        }
      }
    }
  return e.jsxs('div', {
    className: 'rounded-lg border border-dashed border-border bg-surface-2/40 p-3 space-y-2',
    children: [
      e.jsxs('div', {
        className: 'flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted',
        children: [e.jsx(z, { size: 14, className: 'text-ice' }), ' Scan IMEI']
      }),
      e.jsxs('div', {
        className: 'flex flex-wrap items-center gap-2',
        children: [
          e.jsx('input', {
            ref: i,
            type: 'file',
            accept: 'image/*',
            capture: 'environment',
            className: 'hidden',
            onChange: g
          }),
          e.jsx('input', { ref: n, type: 'file', accept: 'image/*', className: 'hidden', onChange: g }),
          e.jsxs(N, {
            type: 'button',
            variant: 'outline',
            size: 'sm',
            onClick: () => {
              var s
              return (s = i.current) == null ? void 0 : s.click()
            },
            disabled: r || p,
            className: 'gap-1.5',
            children: [r ? e.jsx(x, { size: 14, className: 'animate-spin' }) : e.jsx(C, { size: 14 }), ' Take photo']
          }),
          e.jsxs(N, {
            type: 'button',
            variant: 'secondary',
            size: 'sm',
            onClick: () => {
              var s
              return (s = n.current) == null ? void 0 : s.click()
            },
            disabled: r || p,
            className: 'gap-1.5',
            children: [r ? e.jsx(x, { size: 14, className: 'animate-spin' }) : e.jsx(S, { size: 14 }), ' Upload photo']
          }),
          v &&
            e.jsxs('span', {
              className: 'inline-flex items-center text-xs text-success gap-1',
              children: [e.jsx(k, { size: 14 }), ' IMEI read']
            })
        ]
      }),
      m &&
        e.jsxs('p', {
          className: 'text-xs text-ice flex items-center gap-1',
          children: [e.jsx(x, { size: 12, className: 'animate-spin' }), ' Reading IMEI…']
        }),
      f &&
        e.jsxs('p', {
          className: 'text-xs text-danger flex items-center gap-1',
          children: [e.jsx(M, { size: 12 }), ' ', f]
        }),
      e.jsx('p', {
        className: 'text-[11px] text-muted',
        children: 'Photograph the *#06# screen or the IMEI on the phone box. Used only to read the IMEI.'
      })
    ]
  })
}
export { w as I }
