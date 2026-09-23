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
        icon: 'new-folder',
        label: 'New',
        title: 'New',
        description: 'New folder.',
        value: '00',
        tags: ['create', 'new file', 'new folder']
      },
      {
        href: '/form',
        icon: 'folder',
        label: 'Documents',
        title: 'Docs',
        description: 'Documents.',
        value: '02',
        tags: ['docs', 'files']
      },
      {
        href: '/streaming',
        icon: 'account',
        label: 'Projects',
        title: 'Projects',
        description: 'Projects.',
        value: '08',
        tags: ['projects']
      }
    ]
  },
  {
    title: 'Resources',
    items: [
      {
        href: 'https://beast-docs-adv.beastjs.workers.dev',
        icon: 'beast',
        label: 'beast-tsrx',
        title: '',
        description: '',
        value: '↗',
        tags: ['']
      }
    ]
  }
]
