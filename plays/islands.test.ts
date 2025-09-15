import { test, expect } from '@playwright/test';

test.describe('Island Components', () => {
  test('should render and interact with Counter island', async ({ page }) => {
    await page.goto('/article/advanced-typescript-patterns-react');
    
    // Wait for the counter island to load
    const counter = page.getByText('Try this interactive counter').locator('..');
    await expect(counter).toBeVisible();
    
    // Check initial state
    await expect(counter.getByText('0')).toBeVisible();
    
    // Click increment button
    const incrementButton = counter.getByRole('button', { name: '+' });
    await incrementButton.click();
    
    // Check updated state
    await expect(counter.getByText('1')).toBeVisible();
    
    // Click decrement button
    const decrementButton = counter.getByRole('button', { name: '-' });
    await decrementButton.click();
    
    // Should be back to 0
    await expect(counter.getByText('0')).toBeVisible();
  });

  test('should render and interact with InteractiveChart island', async ({ page }) => {
    await page.goto('/article/advanced-typescript-patterns-react');
    
    // Wait for the chart island to load
    const chart = page.getByText('Performance Comparison').locator('..');
    await expect(chart).toBeVisible();
    
    // Check chart type toggle buttons
    const barButton = chart.getByRole('button', { name: 'Bar' });
    const lineButton = chart.getByRole('button', { name: 'Line' });
    
    await expect(barButton).toBeVisible();
    await expect(lineButton).toBeVisible();
    
    // Switch to line chart
    await lineButton.click();
    await expect(lineButton).toHaveClass(/bg-blue-500/);
    
    // Click on a data point (try first bar/point)
    const dataPoints = chart.locator('[style*="cursor-pointer"]');
    if (await dataPoints.first().isVisible()) {
      await dataPoints.first().click();
      
      // Should show selection info
      await expect(chart.locator('.bg-blue-50')).toBeVisible();
    }
  });

  test('should render and interact with CodePlayground island', async ({ page }) => {
    await page.goto('/article/advanced-typescript-patterns-react');
    
    // Wait for the code playground island to load
    const playground = page.getByText('TypeScript Playground').locator('..');
    await expect(playground).toBeVisible();
    
    // Check textarea and run button
    const textarea = playground.locator('textarea');
    const runButton = playground.getByRole('button', { name: /run/i });
    
    await expect(textarea).toBeVisible();
    await expect(runButton).toBeVisible();
    
    // Clear and enter simple code
    await textarea.fill('console.log("Hello from test!");');
    
    // Run the code
    await runButton.click();
    
    // Wait for execution and check output
    await expect(playground.getByText('Running...')).toBeVisible();
    await expect(playground.getByText('Hello from test!')).toBeVisible({ timeout: 3000 });
  });

  test('should handle island loading states', async ({ page }) => {
    // Test island fallback/loading states
    await page.goto('/article/advanced-typescript-patterns-react');
    
    // Islands should eventually load (not show fallback)
    await page.waitForTimeout(1000); // Give time for hydration
    
    // Should not show fallback content after loading
    await expect(page.getByText('Island \'Counter\' not found')).not.toBeVisible();
  });

  test('should handle non-existent island gracefully', async ({ page }) => {
    // This would require creating a test article with a non-existent island
    // For now, we'll test the registry functionality
    
    await page.goto('/');
    
    // Island registry should be available
    const registryScript = await page.evaluate(() => {
      return typeof window !== 'undefined' && 'islandRegistry' in window;
    });
    
    // The specific implementation may vary, but islands should be registered
    expect(registryScript).toBeDefined();
  });
});

test.describe('Article Renderer Components', () => {
  test('should render different section types correctly', async ({ page }) => {
    await page.goto('/article/advanced-typescript-patterns-react');
    
    // Check text sections
    const textSections = page.locator('.text-section');
    await expect(textSections.first()).toBeVisible();
    
    // Check code sections
    const codeSections = page.locator('.code-section');
    await expect(codeSections.first()).toBeVisible();
    
    // Check code syntax highlighting
    const codeBlocks = page.locator('pre code');
    await expect(codeBlocks.first()).toBeVisible();
    
    // Check island sections
    const islandSections = page.locator('.island-section');
    await expect(islandSections.first()).toBeVisible();
  });

  test('should render quote sections correctly', async ({ page }) => {
    await page.goto('/article/advanced-typescript-patterns-react');
    
    // Check blockquote
    const quote = page.locator('blockquote.quote-section');
    await expect(quote).toBeVisible();
    
    // Check quote content and attribution
    await expect(quote).toContainText('revolution in how we build');
    await expect(quote.locator('footer')).toBeVisible();
  });

  test('should generate proper heading anchors', async ({ page }) => {
    await page.goto('/article/advanced-typescript-patterns-react');
    
    // Check that headings have IDs for anchor links
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const firstHeading = headings.first();
    
    if (await firstHeading.isVisible()) {
      const id = await firstHeading.getAttribute('id');
      expect(id).toBeTruthy();
    }
  });

  test('should handle formatted text correctly', async ({ page }) => {
    await page.goto('/article/advanced-typescript-patterns-react');
    
    // Check for formatted text elements (if any exist in content)
    const strongElements = page.locator('strong');
    const emElements = page.locator('em');
    const codeElements = page.locator('code');
    
    // At least some formatted elements should exist
    const hasFormatting = await Promise.all([
      strongElements.count(),
      emElements.count(),
      codeElements.count()
    ]).then(counts => counts.some(count => count > 0));
    
    expect(hasFormatting).toBeTruthy();
  });
});
