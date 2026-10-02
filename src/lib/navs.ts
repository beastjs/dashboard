import type { IconName } from '@/lib/icons/types'

export type NavItem = {
  href: string
  icon: IconName
  label: string
  value: string
  tags: string[]
  description?: string
  short?: string
  disabled?: boolean
}

export type NavGroup = {
  title: string
  items: NavItem[]
  label?: string
}
export const navGroups: NavGroup[] = [
  {
    title: 'Workspace',
    items: [
      {
        href: '/',
        value: 'new',
        icon: 'new-folder',
        label: 'New',
        short: 'New',
        description: 'New Folder',
        tags: ['create', 'new file', 'new folder']
      },
      {
        href: '/projects',
        icon: 'account',
        label: 'Projects',
        short: 'Projects',
        description: 'My Projects',
        value: 'account',
        tags: ['projects']
      },
      {
        href: '/deck-builder',
        icon: 'sidebar',
        label: 'Deck Builder',
        short: 'Deck Builder',
        description: 'My Deck Builder',
        value: 'deck-builder',
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
        label: 'Beast Docs',
        short: 'Beast Docs',
        description: 'Beast Developer Docs',
        value: 'beast-docs',
        tags: ['beast', 'docs']
      }
    ]
  }
]

export const branches: NavGroup[] = [
  {
    title: 'Getting started',
    items: [
      {
        short: 'install',
        value: 'install',
        href: 'install',
        label: 'Installation',
        icon: 'folder',
        description: 'settings',
        tags: ['tags']
      },
      {
        short: 'quick',
        value: 'quick',
        href: 'quick',
        label: 'Quick start',
        icon: 'folder',
        description: 'settings',
        tags: ['tags']
      },
      {
        short: 'config',
        value: 'config',
        href: 'config',
        label: 'Configuration',
        icon: 'folder',
        description: 'settings',
        tags: ['tags']
      }
    ]
  },
  {
    title: 'Components',
    items: [
      {
        short: 'buttons',
        value: 'buttons',
        href: 'buttons',
        label: 'Buttons',
        icon: 'folder',
        description: 'settings',
        tags: ['tags']
      },
      {
        short: 'overlays',
        value: 'overlays',
        href: 'overlays',
        label: 'Overlays',
        icon: 'folder',
        description: 'settings',
        tags: ['tags']
      }
    ]
  }
]
