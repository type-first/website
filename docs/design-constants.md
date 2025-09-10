# Design Constants Reference

This document explains the centralized design constants used throughout the application.

## Cover Image Aspect Ratios

Located in `/lib/design-constants.ts`

### Current Standard: 2.7:1 (Cinematic)
- **Ratio**: `270 / 100` 
- **Tailwind Class**: `aspect-[270/100]`
- **Description**: Wide cinematic format that works well for article covers

### Available Alternatives:
- **16:9 (Video)**: `aspect-video` - Traditional video aspect ratio
- **4:3 (Card)**: `aspect-[4/3]` - Classic card format
- **1:1 (Square)**: `aspect-square` - Square format for thumbnails
- **2:1 (Mobile)**: `aspect-[2/1]` - Less wide for mobile viewing

### Usage:
```tsx
import { COVER_IMAGE } from '@/lib/design-constants';

// Use in component
<div className={`${COVER_IMAGE.ASPECT_CLASS} bg-gray-100`}>
  <img src={src} className="w-full h-full object-cover" />
</div>
```

## Grid Layouts

### Article Grids:
- **Mobile**: 1 column (`grid-cols-1`)
- **Tablet**: 2 columns (`md:grid-cols-2`)
- **Desktop**: 3 columns (`lg:grid-cols-3`)
- **Combined**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### Usage:
```tsx
import { GRID, SPACING } from '@/lib/design-constants';

<div className={`grid ${GRID.ARTICLES.FULL} ${SPACING.CARD_GAP}`}>
  {articles.map(article => <ArticleCard key={article.slug} article={article} />)}
</div>
```

## Spacing

- **Card Gap**: `gap-6` - Standard gap between cards
- **Section Gap**: `gap-8` - Larger gap between sections
- **Content Padding**: `px-6 py-12` - Standard page padding

## How to Update

To change the aspect ratio across the entire application:

1. **Edit** `/lib/design-constants.ts`
2. **Update** `COVER_IMAGE.ASPECT_CLASS` to your preferred ratio
3. **All components** using the constant will automatically update

### Example: Change to 16:9 ratio
```typescript
export const COVER_IMAGE = {
  ASPECT_CLASS: 'aspect-video', // Changed from 'aspect-[270/100]'
  // ... rest of config
}
```

## Files Using These Constants

- `/app/page.tsx` - Home page article cards
- `/app/articles/page.tsx` - Articles index page
- `/app/metadata-inspector/page.tsx` - SEO testing tool
- Any future article listing components

This centralized approach ensures consistency and makes it easy to update the design across the entire application.
