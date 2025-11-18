// Utility and Mapped Type Comparisons
//
// This module explores type relationships with mapped types,
// utility types, and conditional types from TypeScript.

import type { $Equal, $Extends } from './basic-comparisons';

// === Source Types for Transformation ===

export interface UserBase {
  id: string;
  name: string;
  email: string;
  age?: number;
}

// === Built-in Utility Types ===

export type PartialUser = Partial<UserBase>;
export type RequiredUser = Required<UserBase>;
export type PickedUser = Pick<UserBase, 'id' | 'name'>;
export type OmittedUser = Omit<UserBase, 'email'>;

// === Utility Type Relationships ===

export type UserExtendsPartial = $Extends<UserBase, PartialUser>;                      // false (original has required props)
export type PartialExtendsUser = $Extends<PartialUser, UserBase>;                      // false (partial has all optional)
export type RequiredExtendsUser = $Extends<RequiredUser, UserBase>;                    // false (required makes age required)
export type UserExtendsRequired = $Extends<UserBase, RequiredUser>;                    // false (age is optional)

// === Pick and Omit Relationships ===

export type PickedExtendsUser = $Extends<PickedUser, UserBase>;                        // false (missing properties)
export type UserExtendsPicked = $Extends<UserBase, PickedUser>;                        // true (has all picked properties)
export type OmittedExtendsUser = $Extends<OmittedUser, UserBase>;                      // false (missing email)

// === Record Types ===

export type StringRecord = Record<string, string>;
export type NumberRecord = Record<string, number>;
export type MixedRecord = Record<string, string | number>;

export type StringRecordExtendsMixed = $Extends<StringRecord, MixedRecord>;             // true
export type MixedRecordExtendsString = $Extends<MixedRecord, StringRecord>;             // false
export type EmptyObjectExtendsRecord = $Extends<{}, StringRecord>;                     // false (Record requires index signature)

// === Mapped Type Patterns ===

export type ReadonlyUser = {
  readonly [K in keyof UserBase]: UserBase[K];
};

export type OptionalUser = {
  [K in keyof UserBase]?: UserBase[K];
};

export type NullableUser = {
  [K in keyof UserBase]: UserBase[K] | null;
};

// === Mapped Type Relationships ===

export type ReadonlyUserExtendsUser = $Extends<ReadonlyUser, UserBase>;                // false (readonly properties)
export type UserExtendsReadonly = $Extends<UserBase, ReadonlyUser>;                    // true (can assign to readonly)
export type OptionalUserEqualsPartial = $Equal<OptionalUser, PartialUser>;             // true
export type NullableUserExtendsUser = $Extends<NullableUser, UserBase>;                // false (null not assignable)

// === Key Manipulation ===

export type UserKeys = keyof UserBase;
export type RequiredKeys = keyof Required<UserBase>;
export type PartialKeys = keyof Partial<UserBase>;

export type AllKeysEqual = $Equal<UserKeys, RequiredKeys>;                              // true
export type PartialKeysEqual = $Equal<UserKeys, PartialKeys>;                          // true (keyof ignores optionality)

// === Template Literal Types ===

export type EventName = `on${Capitalize<string>}`;
export type SpecificEvent = 'onClick' | 'onSubmit';
export type GenericEvent = `on${string}`;

export type SpecificExtendsGeneric = $Extends<SpecificEvent, GenericEvent>;             // true
export type SpecificExtendsTemplate = $Extends<SpecificEvent, EventName>;              // true
export type GenericExtendsSpecific = $Extends<GenericEvent, SpecificEvent>;            // false

// === Conditional Types ===

export type NonNullable<T> = T extends null | undefined ? never : T;
export type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

export type StringOrNull = string | null;
export type CleanString = NonNullable<StringOrNull>;
export type FunctionType = (x: number) => string;
export type ExtractedReturn = GetReturnType<FunctionType>;

export type CleanStringEqualsString = $Equal<CleanString, string>;                     // true
export type ExtractedReturnEqualsString = $Equal<ExtractedReturn, string>;             // true

// === Index Access Types ===

export type UserId = UserBase['id'];
export type UserOptional = UserBase['age'];
export type UserNameOrEmail = UserBase['name' | 'email'];

export type UserIdEqualsString = $Equal<UserId, string>;                               // true
export type UserOptionalEqualsNumberOrUndefined = $Equal<UserOptional, number | undefined>; // true
export type UserNameOrEmailEqualsString = $Equal<UserNameOrEmail, string>;             // true

// === Complex Utility Combinations ===

export type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>>;
export type RequiredOmit<T, K extends keyof T> = Required<Omit<T, K>>;

export type PartialPickedUser = PartialPick<UserBase, 'name' | 'email'>;
export type RequiredOmittedUser = RequiredOmit<UserBase, 'age'>;

// === Branded Types with Utilities ===

export type Brand<T, B> = T & { __brand: B };
export type UserId_Branded = Brand<string, 'UserId'>;
export type Email_Branded = Brand<string, 'Email'>;

export type BrandedUserIdExtendsString = $Extends<UserId_Branded, string>;             // true
export type StringExtendsBrandedUserId = $Extends<string, UserId_Branded>;             // false
export type DifferentBrandsEqual = $Equal<UserId_Branded, Email_Branded>;              // false

// === Recursive Type Patterns ===

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export interface NestedUser {
  profile: {
    settings: {
      theme: string;
      notifications: boolean;
    };
  };
}

export type DeepReadonlyUser = DeepReadonly<NestedUser>;

// === Practical Examples ===

// API Response patterns
export type ApiResponse<T> = {
  data: T;
  status: 'success' | 'error';
  message?: string;
};

export type UserResponse = ApiResponse<UserBase>;
export type UsersResponse = ApiResponse<UserBase[]>;

export type UserResponseExtendsApiResponse = $Extends<UserResponse, ApiResponse<any>>; // true

console.log('✅ Utility and mapped types showcase TypeScript\'s type transformation power');