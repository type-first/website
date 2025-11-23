/**
 * Typescape Navigation Test
 * 
 * Tests the actual typescape browsing functionality using real components.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jest } from '@jest/globals'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/typescape',
    push: jest.fn(),
    query: {},
    asPath: '/typescape',
  })
}))

// Import actual components
import TypescapeBrowsePage from '@/app/typescape/page'

// Mock the TypeExplorer component to capture TypeScript errors
const mockTypeScriptErrors = jest.fn()
jest.mock('@/modules/playground/components/type-explorer.client', () => {
  return function MockTypeExplorer({ files }: { files: any[] }) {
    // Simulate the bug: when navigating from browse page, TypeScript can't resolve imports
    const hasNavigationState = window.history?.state?.from === 'typescape-browse'
    
    if (hasNavigationState) {
      // Simulate the actual errors we see in the screenshot
      mockTypeScriptErrors([
        'Module "typist" has no exported member \'is_\'',
        'Module "typist" has no exported member \'t_\'', 
        'Module "typist" has no exported member \'test_\'',
        'Module "typist" has no exported member \'yes_\'',
        'Module "typist" has no exported member \'$Equal\'',
        'Module "typist" has no exported member \'example_\''
      ])
    }
    
    return (
      <div data-testid="type-explorer">
        <div data-testid="files-panel">
          {files.map((file, i) => (
            <div key={i} data-testid={`file-${i}`}>
              {file.path}
            </div>
          ))}
        </div>
        <div data-testid="errors-panel">
          {hasNavigationState ? (
            <div data-testid="typescript-errors" className="text-red-600">
              <div>Module "typist" has no exported member 'is_'</div>
              <div>Module "typist" has no exported member 't_'</div>
              <div>Module "typist" has no exported member 'test_'</div>
              <div>Module "typist" has no exported member 'yes_'</div>
              <div>Module "typist" has no exported member '$Equal'</div>
            </div>
          ) : (
            <div data-testid="no-errors">✅ No TypeScript errors</div>
          )}
        </div>
      </div>
    )
  }
})

describe('Typescape Navigation Bug Reproduction', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it('displays registered typescapes and allows navigation', async () => {
    render(<TypescapeBrowsePage />)
    
    // Check that the page loads
    await waitFor(() => {
      expect(screen.getByText('Interactive Typescapes')).toBeInTheDocument()
    })
    
    // Check for our registered typescapes
    await waitFor(() => {
      // Should show typist-intro
      expect(screen.getByText('Typist: Introduction & Fundamentals')).toBeInTheDocument()
      
      // Should show typist-tuple-manipulation  
      expect(screen.getByText('Typist: Advanced Tuple Manipulation')).toBeInTheDocument()
    })
    
    // Check that typescape cards are clickable links
    const typescapeLinks = screen.getAllByRole('link').filter(link => 
      link.getAttribute('href')?.startsWith('/typescape/')
    )
    expect(typescapeLinks.length).toBeGreaterThan(0)
    
    // Verify the links point to our registered scenarios
    const hrefs = typescapeLinks.map(link => link.getAttribute('href'))
    expect(hrefs).toContain('/typescape/typist-intro')
    expect(hrefs).toContain('/typescape/typist-tuple-manipulation')
  })

  it('shows correct statistics for registered typescapes', async () => {
    render(<TypescapeBrowsePage />)
    
    await waitFor(() => {
      // Should show "2" total typescapes (our registered ones)
      expect(screen.getByText('Total Typescapes')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  it('preserves typescape branding consistently', async () => {
    render(<TypescapeBrowsePage />)
    
    await waitFor(() => {
      // Check for typescape logo and text
      expect(screen.getByText('typescape')).toBeInTheDocument()
      expect(screen.getByText('Interactive TypeScript Playground')).toBeInTheDocument()
    })
  })
})
