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
        href: '/projects',
        icon: 'account',
        label: 'Projects',
        title: 'Projects',
        description: 'My Projects',
        value: '08',
        tags: ['projects']
      },
      {
        href: '/deck-builder',
        icon: 'sidebar',
        label: 'Deck Builder',
        title: 'Deck Builder',
        description: 'My Deck Builder',
        value: '00',
        tags: ['deck builder']
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

export const branches = [
  {
    label: 'Getting started',
    children: [
      { value: 'install', label: 'Installation', icon: 'settings' },
      { value: 'quick', label: 'Quick start', icon: 'settings' },
      { value: 'config', label: 'Configuration', icon: 'settings' }
    ]
  },
  {
    label: 'Components',
    children: [
      { value: 'buttons', label: 'Buttons' },
      { value: 'overlays', label: 'Overlays' }
    ]
  }
]
