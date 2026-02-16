# File Naming Convention

## Overview
This document defines the file naming convention used throughout the codebase. File names use descriptive labels followed by technical kind extensions to clearly communicate both purpose and implementation details.

## Convention Format

```
[descriptive-name].[technical-kind].[additional-qualifiers].tsx|ts
```

### Structure Breakdown
- **Descriptive Name**: Kebab-case identifier describing what the file does/contains
- **Technical Kind**: Primary classification denoting the technical nature of the file
- **Additional Qualifiers**: Optional modifiers for platform, environment, or specialization
- **File Extension**: `.tsx` for React components, `.ts` for TypeScript files

## Technical Kind Extensions

### Component Classifications
- `.client` - Client components (uses 'use client' directive)
- `.pure` - Pure/stateless components (no side effects, server-rendered)
- `.layout` - Layout/container components that structure page areas
- `.modal` - Modal/dialog components that overlay content
- `.form` - Form components for user input
- `.provider` - Context/provider components that wrap children

### Function Classifications
- `.logic` - Pure functions, business logic (isomorphic)
- `.util` - Utility functions (non-component, non-async)
- `.action` - Async functions that perform side effects or mutations
- `.hook` - Custom React hooks
- `.service` - Stateful classes serving as API interfaces

### Data & Configuration Classifications
- `.registry` - Files that import and index code constructs of the same kind
- `.model` - Data models, type definitions, interfaces
- `.config` - Configuration objects and settings

## Examples

### Components
```typescript
// Client component for navigation
nav-sidebar.client.tsx

// Mobile-specific client component  
top-bar.client.mobile.tsx

// Server layout component for mobile
top-bar.mobile.layout.tsx

// Modal component for search
search-dialog.modal.tsx

// Form component (client-side)
comment.form.client.tsx

// Provider component
app.provider.tsx
```

### Functions & Logic
```typescript
// Utility functions
chat-controls.util.ts

// Business logic functions
user-validation.logic.ts

// Server actions
post-submission.action.ts

// Custom React hook
use-local-storage.hook.ts

// API service class
database.service.ts
```

### Data & Configuration
```typescript
// Component registry
components.registry.ts

// Data models
user.model.ts

// Configuration
database.config.ts
```

## Rules & Guidelines

### Primary Rules
1. **Technical kinds are required** - Every file must have a technical kind extension
2. **Feature names are not technical kinds** - Avoid extensions like `.search`, `.auth`, `.navigation`
3. **Descriptive names use kebab-case** - `user-profile`, not `userProfile` or `UserProfile`
4. **Extensions follow specificity order** - Most specific technical kind first, then qualifiers

### Qualifier Guidelines
- Use `.mobile` for mobile-specific implementations
- Use `.desktop` for desktop-specific implementations  
- Use `.dev` for development-only files
- Use `.test` for test files
- Multiple qualifiers are allowed: `api.client.mobile.tsx`

### Anti-Patterns
```typescript
// ❌ Wrong - feature name as extension
search-bar.search.tsx
user-menu.auth.tsx

// ❌ Wrong - no technical kind
search-bar.tsx (unclear if client/pure/layout)

// ❌ Wrong - camelCase
searchBar.client.tsx

// ✅ Correct
search-bar.client.tsx
user-menu.pure.tsx
```

## Migration Notes

Previous documentation files created under `docs/` have been moved to their appropriate location in the `journal/` directory to maintain project history and context.

## Directory Structure Context

This naming convention works in conjunction with the module-based directory structure:

```
modules/
├── navigation/
│   └── components/
│       ├── nav-sidebar.client.tsx
│       ├── top-bar.client.mobile.tsx
│       ├── top-bar.mobile.layout.tsx
│       └── breadcrumbs.client.tsx
├── search/
│   └── components/
│       ├── search-launcher.client.tsx
│       └── search-dialog.modal.tsx
└── chat/
    ├── components/
    │   └── chat-sidebar.client.tsx
    └── utils/
        └── chat-controls.util.ts
```

## Benefits

1. **Immediate Technical Understanding** - File purpose is clear from name alone
2. **IDE/Editor Benefits** - Better autocomplete, filtering, and organization
3. **Consistent Classification** - Standardized technical vocabulary across codebase
4. **Refactoring Safety** - Clear boundaries between different types of code
5. **Onboarding Efficiency** - New developers understand file purposes quickly

## Enforcement

- TypeScript compilation enforces import/export consistency
- No barrel files (`index.ts`) - explicit imports required
- File naming is validated during code review process
