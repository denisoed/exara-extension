# Technical Context

## Technologies Used
1. **Core Technologies**
   - TypeScript
   - React
   - WXT (Web Extension Framework)
   - Bun
   - Vite

2. **UI and Styling**
   - shadcn/ui
   - Tailwind CSS
   - React Hook Form

3. **Development Tools**
   - Biome (linting and formatting)
   - Husky (git hooks)
   - GitHub Actions (CI/CD)

## Development Setup
1. **Prerequisites**
   - Bun runtime
   - Node.js (for some tools)
   - Git

2. **Environment Variables**
   - `.env` file for configuration
   - `.env.example` template
   - Secure key management

3. **Build Process**
   - Development mode with hot reloading
   - Production builds for Chrome and Firefox
   - Automated publishing pipeline

## Technical Constraints
1. **Browser Compatibility**
   - Chrome Manifest V3
   - Firefox Manifest V2
   - Cross-browser API differences

2. **Performance**
   - Service worker limitations
   - Content script injection
   - Memory usage optimization

3. **Security**
   - Content Security Policy
   - Permission management
   - Data encryption

## Dependencies
1. **Core Dependencies**
   - @types/chrome
   - react
   - react-dom
   - wxt

2. **Development Dependencies**
   - @types/node
   - biome
   - husky
   - typescript

3. **UI Dependencies**
   - @radix-ui/react-*
   - tailwindcss
   - react-hook-form

## Configuration Files
1. **Build Configuration**
   - wxt.config.ts
   - tsconfig.json
   - tailwind.config.ts

2. **Linting and Formatting**
   - biome.json
   - commitlint.config.ts

3. **Git Configuration**
   - .gitignore
   - .husky/
   - .github/ 