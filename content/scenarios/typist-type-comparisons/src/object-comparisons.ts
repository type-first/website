// Object Shape Comparisons
//
// This module demonstrates structural type comparisons
// with interfaces and object types.

import type { $Equal, $Extends } from './basic-comparisons';

// === Interface Definitions ===

export interface User {
  id: string;
  name: string;
}

export interface Admin {
  id: string;
  name: string;
  permissions: string[];
}

export interface Guest {
  sessionId: string;
}

export interface SuperAdmin extends Admin {
  globalAccess: boolean;
}

// === Structural Type Relationships ===

// Test structural relationships
export type AdminExtendsUser = $Extends<Admin, User>;           // true (structural superset)
export type UserExtendsAdmin = $Extends<User, Admin>;           // false (missing permissions)
export type GuestExtendsUser = $Extends<Guest, User>;           // false (different structure)
export type SuperAdminExtendsAdmin = $Extends<SuperAdmin, Admin>; // true

// === Exact Equality Tests ===

export type UserEqualsUser = $Equal<User, User>;                // true
export type UserEqualsAdmin = $Equal<User, Admin>;              // false
export type AdminEqualsAdmin = $Equal<Admin, Admin>;            // true

// === Optional Properties ===

export interface OptionalUser {
  id: string;
  name?: string;
  email?: string;
}

export interface RequiredUser {
  id: string;
  name: string;
  email: string;
}

export type OptionalExtendsRequired = $Extends<OptionalUser, RequiredUser>;    // false
export type RequiredExtendsOptional = $Extends<RequiredUser, OptionalUser>;    // true

// === Readonly Properties ===

export interface ReadonlyUser {
  readonly id: string;
  readonly name: string;
}

export type ReadonlyExtendsUser = $Extends<ReadonlyUser, User>;  // true (readonly is less restrictive for reading)
export type UserExtendsReadonly = $Extends<User, ReadonlyUser>;  // false (mutable can't be assigned to readonly)

// === Index Signatures ===

export interface StringMap {
  [key: string]: string;
}

export interface NumberMap {
  [key: string]: number;
}

export interface SpecificStringMap {
  id: string;
  name: string;
}

export type SpecificExtendsStringMap = $Extends<SpecificStringMap, StringMap>;  // true
export type StringMapExtendsSpecific = $Extends<StringMap, SpecificStringMap>;  // false

console.log('✅ Object shape comparisons demonstrate structural typing');