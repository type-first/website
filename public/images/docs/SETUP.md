# Adding Typist PNG Images

To complete the typist documentation setup, you need to save the provided images as PNG files:

## Required Files

### 1. Logo (`typist-logo.png`)
- **Source**: The "tf" logo from the provided images
- **Location**: `/public/images/docs/typist-logo.png`
- **Size**: Recommended 64x64px or 128x128px for crisp rendering
- **Usage**: Used in doc library cards, navigation, and small contexts

### 2. Cover Image (`typist-cover.png`) 
- **Source**: The blue cover image with "T_<T>" typography
- **Location**: `/public/images/docs/typist-cover.png`
- **Size**: Recommended 1200x630px for optimal display
- **Usage**: Used in documentation headers, social sharing, and large contexts

## How to Add the Images

1. Extract/crop the "tf" logo from the provided image
2. Save it as a square PNG with transparent background: `public/images/docs/typist-logo.png`
3. Save the full cover image as: `public/images/docs/typist-cover.png`
4. The paths are already configured in `content/docs/typist/meta.ts`

## Current Configuration

```typescript
// In content/docs/typist/meta.ts
logoUrl: '/images/docs/typist-logo.png',      // Small logo for cards
coverImgUrl: '/images/docs/typist-cover.png', // Large cover for headers
```

Once these files are added, the typist documentation will display with proper branding throughout the application.