import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and display main content', async ({ page }) => {
    await page.goto('/');
    
    // Check main heading
    await expect(page.getByRole('heading', { name: /welcome to our blog/i })).toBeVisible();
    
    // Check description
    await expect(page.getByText(/discover insights, tutorials/i)).toBeVisible();
    
    // Check "Latest Articles" section
    await expect(page.getByRole('heading', { name: /latest articles/i })).toBeVisible();
    
    // Check "View all articles" link
    await expect(page.getByRole('link', { name: /view all articles/i })).toBeVisible();
  });

  test('should navigate to articles page', async ({ page }) => {
    await page.goto('/');
    
    // Click "View all articles" link
    await page.getByRole('link', { name: /view all articles/i }).click();
    
    // Should be on articles page
    await expect(page).toHaveURL('/articles');
    await expect(page.getByRole('heading', { name: /all articles/i })).toBeVisible();
  });

  test('should display technology badges', async ({ page }) => {
    await page.goto('/');
    
    // Check for technology badges
    await expect(page.getByText('Next.js 15')).toBeVisible();
    await expect(page.getByText('Server Components')).toBeVisible();
    await expect(page.getByText('Islands Architecture')).toBeVisible();
    await expect(page.getByText('TypeScript')).toBeVisible();
  });
});

test.describe('Articles Page', () => {
  test('should load articles listing', async ({ page }) => {
    await page.goto('/articles');
    
    // Check page title
    await expect(page.getByRole('heading', { name: /all articles/i })).toBeVisible();
    
    // Check if articles are displayed (assuming we have seeded data)
    const articles = page.locator('article');
    await expect(articles.first()).toBeVisible();
  });

  test('should filter articles by tag', async ({ page }) => {
    await page.goto('/articles');
    
    // Find and click a tag
    const firstTag = page.locator('[href*="tag="]').first();
    if (await firstTag.isVisible()) {
      const tagText = await firstTag.textContent();
      await firstTag.click();
      
      // Check URL includes tag parameter
      await expect(page).toHaveURL(/tag=/);
      
      // Check filtered content message
      await expect(page.getByText(new RegExp(`Articles tagged with "${tagText}"`, 'i'))).toBeVisible();
    }
  });

  test('should navigate to individual article', async ({ page }) => {
    await page.goto('/articles');
    
    // Click on first article link
    const firstArticleLink = page.locator('article h3 a').first();
    if (await firstArticleLink.isVisible()) {
      await firstArticleLink.click();
      
      // Should be on article page
      await expect(page).toHaveURL(/\/articles\/[^\/]+$/);
      
      // Should have article content
      await expect(page.locator('article')).toBeVisible();
      await expect(page.getByRole('link', { name: /back to articles/i })).toBeVisible();
    }
  });
});

test.describe('Individual Article Page', () => {
  test('should load article content', async ({ page }) => {
    // Navigate to a specific article (using known slug from fixtures)
    await page.goto('/article/advanced-typescript-patterns-react');
    
    // Check article title
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Check back navigation
    await expect(page.getByRole('link', { name: /back to articles/i })).toBeVisible();
    
    // Check article content
    await expect(page.locator('article')).toBeVisible();
    
    // Check tags
    const tags = page.locator('[href*="tag="]');
    await expect(tags.first()).toBeVisible();
  });

  test('should display article metadata', async ({ page }) => {
    await page.goto('/article/advanced-typescript-patterns-react');
    
    // Check publication date
    await expect(page.locator('time')).toBeVisible();
    
    // Check tags section in footer
    await expect(page.getByText('Tags:')).toBeVisible();
  });

  test('should have proper SEO elements', async ({ page }) => {
    await page.goto('/article/advanced-typescript-patterns-react');
    
    // Check page title
    await expect(page).toHaveTitle(/getting started/i);
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
    
    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /.+/);
  });
});

test.describe('Search Functionality', () => {
  test('should perform text search', async ({ page }) => {
    // Test text search API
    const response = await page.request.get('/api/search/text?q=nextjs&limit=5');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('query', 'nextjs');
    expect(data).toHaveProperty('results');
    expect(Array.isArray(data.results)).toBeTruthy();
  });

  test('should handle invalid search parameters', async ({ page }) => {
    // Test empty query
    const response = await page.request.get('/api/search/text?q=');
    expect(response.status()).toBe(400);
    
    // Test invalid limit
    const response2 = await page.request.get('/api/search/text?q=test&limit=100');
    expect(response2.status()).toBe(400);
  });
});

test.describe('Sitemap and Robots', () => {
  test('should serve sitemap.xml', async ({ page }) => {
    const response = await page.request.get('/sitemap.xml');
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('xml');
  });

  test('should serve robots.txt', async ({ page }) => {
    const response = await page.request.get('/robots.txt');
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('text');
  });
});
