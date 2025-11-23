/**
 * Jest Setup for Typescape Tests
 * 
 * Setup file for typescape integration tests that handles
 * navigation state management and TypeScript error scenarios.
 */

import '@testing-library/jest-dom'
import { jest } from '@jest/globals'

// Mock window.performance for navigation type detection
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    navigation: {
      type: 0 // 0: navigate, 1: reload, 2: back_forward
    },
    getEntriesByType: jest.fn().mockReturnValue([
      { type: 'navigate' }
    ]),
    now: jest.fn().mockReturnValue(Date.now())
  }
})

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    // Only show actual test failures, not React warnings
    if (typeof args[0] === 'string' && !args[0].includes('Warning:')) {
      originalConsoleError(...args)
    }
  }
  
  console.warn = (...args) => {
    // Suppress React warnings in tests
    if (typeof args[0] === 'string' && !args[0].includes('Warning:')) {
      originalConsoleWarn(...args)
    }
  }
})

afterAll(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})

// Reset mocks between tests
afterEach(() => {
  jest.clearAllMocks()
  
  // Reset navigation state
  window.performance.navigation.type = 0
  window.performance.getEntriesByType.mockReturnValue([
    { type: 'navigate' }
  ])
})

// Global test utilities
global.mockPageRefresh = () => {
  window.performance.navigation.type = 1
  window.performance.getEntriesByType.mockReturnValue([
    { type: 'reload' }
  ])
}

global.mockBackForwardNavigation = () => {
  window.performance.navigation.type = 2
  window.performance.getEntriesByType.mockReturnValue([
    { type: 'back_forward' }
  ])
}

global.mockDirectNavigation = () => {
  window.performance.navigation.type = 0
  window.performance.getEntriesByType.mockReturnValue([
    { type: 'navigate' }
  ])
}

// Mock IntersectionObserver for any components that might use it
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock ResizeObserver for Monaco Editor
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}