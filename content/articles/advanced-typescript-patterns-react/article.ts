/**
 * Advanced TypeScript Patterns for React Applications - Article Definition
 * Using the new lib/content system
 */

import { 
  createArticle, 
  normal, 
  bold, 
  italic, 
  code, 
  link, 
  carriage 
} from '@/lib/content'
import { typeFirstTeam } from '../../contributors/contributors'

// --- Article Content Definitions

export const introductionParagraph = [
  normal('TypeScript has revolutionized React development by providing '),
  bold('static type checking'),
  normal(' and enhanced developer experience. In this comprehensive guide, we\'ll explore '),
  italic('advanced TypeScript patterns'),
  normal(' that will elevate your React applications to new levels of '),
  bold('type safety'),
  normal(' and '),
  bold('maintainability'),
  normal('.'),
  carriage(),
  carriage(),
  normal('We\'ll cover essential patterns like '),
  code('typescript', 'Generic Components'),
  normal(', '),
  code('typescript', 'Conditional Types'),
  normal(', and '),
  link('Type-Safe APIs', '#type-safe-apis'),
  normal(' that every TypeScript React developer should master.')
] as const

export const genericsIntroduction = [
  normal('Generic components are one of the most '),
  bold('powerful patterns'),
  normal(' in TypeScript React development. They allow you to create '),
  italic('reusable components'),
  normal(' that work with different data types while maintaining '),
  bold('type safety'),
  normal('.')
] as const

export const genericsExample = [
  normal('Consider this basic pattern:'),
  carriage(),
  carriage(),
  normal('The '),
  code('typescript', '<T>'),
  normal(' type parameter allows the '),
  code('typescript', 'List'),
  normal(' component to accept an array of any type, while the '),
  code('typescript', 'renderItem'),
  normal(' function is properly typed to receive the correct item type.')
] as const

export const conditionalTypesIntro = [
  normal('Conditional types allow you to create '),
  bold('dynamic type relationships'),
  normal(' based on type conditions. This enables more '),
  italic('flexible'),
  normal(' and '),
  italic('expressive'),
  normal(' component APIs.')
] as const

export const conditionalTypesExample = [
  normal('Advanced conditional type example demonstrates how you can use '),
  code('typescript', 'extends'),
  normal(' keyword to create type-level logic that adapts based on the input types, providing '),
  bold('maximum type safety'),
  normal(' with '),
  bold('minimal boilerplate'),
  normal('.')
] as const

export const apiIntroduction = [
  normal('Creating '),
  bold('type-safe APIs'),
  normal(' involves using TypeScript\'s type system to ensure that your '),
  italic('API calls'),
  normal(', '),
  italic('responses'),
  normal(', and '),
  italic('error handling'),
  normal(' are all properly typed from end to end.')
] as const

export const apiExample = [
  normal('API client pattern provides '),
  bold('compile-time guarantees'),
  normal(' that your API calls match your backend contracts, reducing runtime errors and improving '),
  italic('developer confidence'),
  normal('.')
] as const

export const bestPracticesIntro = [
  normal('Here are the essential '),
  bold('best practices'),
  normal(' for advanced TypeScript React development:')
] as const

export const bestPracticesList = [
  normal('• Use '),
  code('typescript', 'strict'),
  normal(' mode for maximum type safety'),
  carriage(),
  normal('• Leverage '),
  code('typescript', 'utility types'),
  normal(' like '),
  code('typescript', 'Pick'),
  normal(', '),
  code('typescript', 'Omit'),
  normal(', and '),
  code('typescript', 'Partial'),
  carriage(),
  normal('• Implement proper '),
  bold('error boundaries'),
  normal(' with typed error handling'),
  carriage(),
  normal('• Use '),
  italic('discriminated unions'),
  normal(' for complex state management'),
  carriage(),
  normal('• Document complex types with '),
  code('typescript', 'JSDoc'),
  normal(' comments')
] as const

export const conclusionParagraph = [
  normal('Advanced TypeScript patterns provide the '),
  bold('foundation'),
  normal(' for building '),
  italic('robust'),
  normal(', '),
  italic('maintainable'),
  normal(' React applications. By mastering these patterns, you\'ll write '),
  bold('safer code'),
  normal(', catch '),
  bold('more bugs at compile time'),
  normal(', and create '),
  italic('better developer experiences'),
  normal(' for your team.'),
  carriage(),
  carriage(),
  normal('Continue exploring advanced patterns in our '),
  link('TypeScript Deep Dive series', '/articles?tag=typescript'),
  normal(' and join our '),
  link('community discussions', '/community'),
  normal(' to share your own patterns and learn from others.')
] as const

// --- Article Definition

export const article = createArticle({
  name: 'Advanced TypeScript Patterns for React Applications',
  slug: 'advanced-typescript-patterns-react',
  blurb: 'Master advanced TypeScript patterns to build type-safe, maintainable React applications with confidence.',
  tags: ['TypeScript', 'React', 'Advanced', 'Patterns', 'Type Safety'],
  author: typeFirstTeam,
  publishedTs: new Date('2024-03-15').getTime(),
  coverImgUrl: '/images/covers/advanced-typescript-patterns-react.png'
})
