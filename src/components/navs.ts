import type { IconName } from '@/lib/icons/types'

export type NavItem = {
  href: string
  icon: IconName
  label: string
  description: string
  title: string
  value: string | number
  tags: string[]
}

export type NavGroup = {
  title: string
  items: NavItem[]
}
export const navGroups: NavGroup[] = [
  {
    title: 'Workspace',
    items: [
      {
        href: '/',
        icon: 'overview',
        label: 'Overview',
        title: '',
        description: '',
        value: '00',
        tags: []
      },
      {
        href: '/form',
        icon: 'forms',
        label: 'Form',
        title: 'Adaptive Form with Validation Streams',
        description:
          'Composable async flows and cancellation. Debounced 300ms, cancelOnUpdate, race handling. No manual subscriptions.',
        value: '02',
        tags: ['AbortController', 'optimistic UI']
      },
      {
        href: '/streaming',
        icon: 'play',
        label: 'Streaming',
        title: 'Streaming — Edge at CDN',
        description: 'Streams progressively from edge — yield skeleton then each card. Keyed cache at CDN.',
        value: '08',
        tags: ['streaming']
      }
    ]
  },
  {
    title: 'Resources',
    items: [
      {
        href: 'https://beast-docs.vercel.app',
        icon: 'mechanics',
        label: 'beast-tsrx',
        title: '',
        description: '',
        value: '↗',
        tags: ['']
      }
    ]
  }
]
