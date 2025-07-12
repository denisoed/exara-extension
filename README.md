# Exara – AI Assistant

![Exara Logo](src/assets/logo.svg)

**Exara** is a modern boilerplate for creating browser extensions powered by AI. It bundles a ready-to-use setup with React, TypeScript and Tailwind CSS so you can focus on building features rather than configuration.

## Key Features

- Pre-configured pages for popup, options and side panel
- Authentication and storage utilities
- Content script support and DevTools integration
- New tab customization and custom pages
- Cross‑browser builds for Chrome and Firefox

## Getting Started

```bash
bun install
bun dev
```

The development server supports hot reloading. Production builds are generated via:

```bash
bun run build
```

## Development

Exara uses the following technologies:

- **React** and **TypeScript** for UI components
- **Tailwind CSS** with shadcn/ui
- **WXT** for the extension build pipeline
- **Biome** for linting and formatting

See the memory-bank folder for more context about the project.

## License

This project is licensed under the MIT License.
