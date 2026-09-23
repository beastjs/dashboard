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
        description: 'New Folder',
        value: '00',
        tags: ['create', 'new file', 'new folder']
      },
      {
        href: '/documents',
        icon: 'folder',
        label: 'Documents',
        title: 'Docs',
        description: 'My Documents',
        value: '02',
        tags: ['docs', 'files']
      },
      {
        href: '/projects',
        icon: 'account',
        label: 'Projects',
        title: 'Projects',
        description: 'My Projects',
        value: '08',
        tags: ['projects']
      },
      {
        href: '/settings',
        icon: 'mechanics',
        label: 'Settings',
        title: 'Settings',
        description: 'My Settings',
        value: '00',
        tags: ['settings']
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
