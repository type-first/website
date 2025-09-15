// Centralized design constants for the application

export const COVER_IMAGE = {
  // Standard aspect ratio for article cover images
  // Using 2.7:1 ratio (270:100) for a cinematic feel that works well across devices
  ASPECT_RATIO: '270 / 100', // CSS aspect-ratio value
  ASPECT_CLASS: 'aspect-[270/100]', // Tailwind CSS class
  
  // Alternative ratios if needed
  RATIOS: {
    CINEMATIC: '270 / 100', // 2.7:1 - current standard
    WIDE: '16 / 9',          // 16:9 - video standard
    CARD: '4 / 3',           // 4:3 - traditional card format
    SQUARE: '1 / 1',         // 1:1 - square
  },
  
  // Responsive breakpoints for different aspect ratios if needed
  RESPONSIVE: {
    // Mobile: slightly less wide for better mobile viewing
    MOBILE: '2 / 1',
    // Desktop: standard cinematic
    DESKTOP: '270 / 100',
  }
} as const;

export const GRID = {
  // Standard grid configurations
  ARTICLES: {
    MOBILE: 'grid-cols-1',
    TABLET: 'md:grid-cols-2', 
    DESKTOP: 'lg:grid-cols-3',
    FULL: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }
} as const;

export const SPACING = {
  // Standard spacing values
  CARD_GAP: 'gap-6',
  SECTION_GAP: 'gap-8',
  CONTENT_PADDING: 'px-6 py-12',
} as const;
