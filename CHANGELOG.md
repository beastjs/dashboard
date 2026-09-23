# Changelog

All notable changes to `saia` will be recorded here.

## [Unreleased]

### Changed

- Use the context directly in the theme provider, preparing for Octane's removal of the legacy `Context.Provider` alias while retaining compatibility with Octane 0.2.13.

### Fixed

- Mount the theme provider above the topbar so `ThemeToggle` can read and update the theme context.

- Replace the invalid sidebar callback placeholder in `App.btsx` with an empty function so the application builds.
- Rename the icon component to `Icon.btsx` so directory imports resolve to the named exports in `index.ts`.
