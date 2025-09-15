# Auth System Reorganization

## Overview
Reorganized the entire authentication system into a self-contained `lib/auth/` module following the same architectural patterns established for articles and labs.

## Structure Created

```
lib/auth/
├── config.ts              # NextAuth configuration (moved from auth.ts)
├── index.ts              # Main exports for the auth module
├── components/
│   ├── index.ts          # Component exports
│   ├── auth-provider.tsx # Session provider with fallback (from AuthProvider.tsx)
│   ├── auth-menu.tsx     # Auth menu component (from AuthMenu.tsx)
│   ├── auth-popup-buttons.tsx # Popup sign-in buttons (from AuthPopupButtons.tsx)
│   ├── require-auth-button.tsx # Auth-required button (from RequireAuthButton.tsx)
│   └── auth-wrapper.tsx  # Combined provider + menu (from AuthWrapper.tsx)
└── utils/
    ├── index.ts          # Utility exports
    └── popup.ts          # Shared popup window utilities
```

## Components Moved & Updated

### Components Migrated:
- `AuthProvider.tsx` → `lib/auth/components/auth-provider.tsx`
- `AuthMenu.tsx` → `lib/auth/components/auth-menu.tsx`
- `AuthPopupButtons.tsx` → `lib/auth/components/auth-popup-buttons.tsx`
- `RequireAuthButton.tsx` → `lib/auth/components/require-auth-button.tsx`
- `AuthWrapper.tsx` → `lib/auth/components/auth-wrapper.tsx`

### Configuration Migrated:
- `auth.ts` → `lib/auth/config.ts`

### Utilities Created:
- Extracted shared popup window logic to `lib/auth/utils/popup.ts`
- Components now use shared utilities instead of duplicated code

## Import Updates

All import statements throughout the codebase have been updated:

### Pages & Components:
- `components/MobileTopBar.tsx`: Updated AuthMenu import
- `components/NavSidebar.tsx`: Updated AuthProvider import
- `components/Providers.tsx`: Now uses lib/auth exports
- Community pages: Updated RequireAuthButton imports

### API Routes:
- `app/api/auth/[...nextauth]/route.ts`: Updated handlers import
- `app/api/community/posts/route.ts`: Updated auth import
- `app/api/covers/upload/route.ts`: Updated auth import
- `app/api/community/posts/[id]/comments/route.ts`: Updated auth import

## Benefits Achieved

1. **Self-contained Module**: Auth feature is now entirely contained within `lib/auth/`
2. **Consistent Architecture**: Follows same patterns as articles and labs modules
3. **Reusable Components**: All auth components properly exported and organized
4. **Shared Utilities**: Eliminated code duplication in popup handling
5. **Clean Imports**: Simple `import { AuthProvider } from '@/lib/auth'` syntax
6. **Type Safety**: All TypeScript compilation passes successfully

## Build Status
✅ TypeScript compilation successful
✅ All auth-related imports updated
✅ Old component files cleaned up
✅ Consistent kebab-case naming convention applied
