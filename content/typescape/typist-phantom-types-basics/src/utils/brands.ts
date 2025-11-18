// Branded Types and Phantom Type Utilities
//
// This file demonstrates how to create branded types using phantom fields
// to achieve nominal typing in TypeScript's structural type system.

// === Branded Type Pattern ===

// Create distinct types from primitives using phantom brands
type Brand<T, TBrand extends string> = T & { readonly __brand: TBrand };

// Specific branded types for our domain
export type UserId = Brand<string, 'UserId'>;
export type EmailAddress = Brand<string, 'EmailAddress'>;

// === Constructor Functions ===

// These functions create branded values with runtime validation
export function createUserId(id: string): UserId {
  if (!id.startsWith('user_')) {
    throw new Error('UserId must start with "user_"');
  }
  return id as UserId;
}

export function createEmail(email: string): EmailAddress {
  if (!email.includes('@')) {
    throw new Error('Invalid email format');
  }
  return email as EmailAddress;
}

// === Utility Functions ===

// Functions that work with branded types
export function formatUserId(userId: UserId): string {
  return `User: ${userId}`;
}

export function getEmailDomain(email: EmailAddress): string {
  return email.split('@')[1];
}

// === Type Guards ===

export function isUserId(value: string): value is UserId {
  return value.startsWith('user_');
}

export function isEmailAddress(value: string): value is EmailAddress {
  return value.includes('@') && value.indexOf('@') > 0 && value.indexOf('@') < value.length - 1;
}

// === Example Usage ===

// Valid constructions
const validUserId = createUserId('user_12345');
const validEmail = createEmail('john@example.com');

// These would throw at runtime:
// const invalidUserId = createUserId('12345'); // Error: must start with 'user_'
// const invalidEmail = createEmail('not-an-email'); // Error: invalid format

// Type safety prevents mixing branded types
function processUser(id: UserId, email: EmailAddress) {
  console.log(`Processing user ${formatUserId(id)} with email domain: ${getEmailDomain(email)}`);
}

// This works:
processUser(validUserId, validEmail);

// These would be type errors:
// processUser(validEmail, validUserId); // Wrong order!
// processUser('user_123', 'john@example.com'); // Not branded types!

export { validUserId, validEmail, processUser };