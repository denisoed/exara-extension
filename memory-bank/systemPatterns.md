# System Patterns

## Architecture Overview
The extension follows a modular architecture with clear separation of concerns:

1. **Entry Points**
   - Background service worker
   - Content scripts
   - DevTools integration
   - New tab page
   - Options page
   - Popup window
   - Side panel
   - Custom pages

2. **Core Components**
   - Authentication system
   - Storage management
   - Message passing
   - UI components
   - State management
   - Internationalization
   - Analytics

3. **UI Components**
   - Floating button
   - Multi-state popup
   - Action button
   - Content display
   - Control buttons
   - Drag handle
   - Loading states
   - Preview states

## Design Patterns
1. **Service Worker Pattern**
   - Background script as service worker
   - Event-driven architecture
   - Message passing between components

2. **Component Architecture**
   - React functional components
   - Hooks for state management
   - Custom hooks for extension-specific logic
   - Forward refs for DOM manipulation
   - Callback memoization for performance
   - Component composition
   - State machine pattern for UI states

3. **Message Passing**
   - Type-safe message interfaces
   - Centralized message handling
   - Cross-component communication

4. **Storage Management**
   - Type-safe storage interfaces
   - Encrypted storage for sensitive data
   - Synchronized storage across components

5. **UI Interaction Patterns**
   - Fixed positioning for floating elements
   - Smooth drag and drop operations
   - Viewport-aware positioning
   - Dedicated drag handles
   - Responsive layout adjustments
   - State-based transitions
   - Smooth animations

6. **State Management**
   - Enum-based state machine
   - State transition handlers
   - Loading state management
   - Preview state handling
   - Error state handling

## Component Relationships
```mermaid
graph TD
    A[Background Service Worker] --> B[Content Scripts]
    A --> C[Popup]
    A --> D[Options]
    A --> E[New Tab]
    A --> F[Side Panel]
    B --> G[Web Page]
    C --> A
    D --> A
    E --> A
    F --> A
    
    subgraph UI Components
        H[Floating Button] --> I[Popup]
        I --> J[Preview State]
        I --> K[Loading State]
        I --> L[Answer State]
        I --> M[Drag Handle]
        I --> N[Control Buttons]
        I --> O[Action Button]
    end
```

## Key Technical Decisions
1. **Framework Choice**
   - WXT for extension development
   - React for UI components
   - TypeScript for type safety

2. **Build System**
   - Bun as package manager
   - Vite for development
   - Custom build configuration

3. **UI Framework**
   - shadcn/ui for components
   - Tailwind for styling
   - Custom theme support
   - Fixed positioning strategy
   - Drag and drop implementation
   - Animation system

4. **Development Tools**
   - Biome for linting
   - Husky for git hooks
   - GitHub Actions for CI/CD

5. **Interaction Patterns**
   - Mouse event-based drag operations
   - Position-based offset calculations
   - Viewport boundary constraints
   - Smooth movement transitions
   - State-based animations
   - Component composition

6. **State Management**
   - Enum-based state machine
   - React hooks for state
   - Event-driven state transitions
   - Loading state handling
   - Error state management 