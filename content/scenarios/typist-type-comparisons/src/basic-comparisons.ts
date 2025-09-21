// Basic Type Comparison Examples
//
// This module demonstrates fundamental type comparisons
// using $Equal and $Extends operators.

// === Core Type Comparison System ===

// Simulate typist's core comparison types
export type $Equal<T1, T2> = 
  (<T>() => T extends T1 ? 1 : 2) extends (<T>() => T extends T2 ? 1 : 2)
    ? true
    : false;

export type $Extends<L, R> = L extends R ? true : false;

// Verdict types (simplified)
export type $Yes = { readonly __verdict: 'yes' };
export type $No<TReason extends string = string> = { readonly __verdict: 'no'; readonly reason: TReason };

// === Basic Type Comparisons ===

// Test exact type equality with $Equal
export type StringEqualsString = $Equal<string, string>;        // true
export type StringEqualsNumber = $Equal<string, number>;        // false
export type StringEqualsAny = $Equal<string, any>;              // false

// Test type assignability with $Extends  
export type StringExtendsAny = $Extends<string, any>;           // true
export type AnyExtendsString = $Extends<any, string>;           // true (any is special)
export type NumberExtendsString = $Extends<number, string>;     // false

console.log('✅ Basic type comparisons work at the type level');

// === Primitive Type Relationships ===

export type BooleanExtendsBooleanLiteral = $Extends<boolean, true | false>;     // true
export type BooleanLiteralExtendsBoolean = $Extends<true, boolean>;             // true
export type NumberExtendsNumberLiteral = $Extends<number, 42>;                  // false (more general)
export type NumberLiteralExtendsNumber = $Extends<42, number>;                  // true (more specific)

// === Union Type Comparisons ===

export type StringOrNumberExtendsAny = $Extends<string | number, any>;          // true
export type StringExtendsStringOrNumber = $Extends<string, string | number>;    // true
export type StringOrNumberExtendsString = $Extends<string | number, string>;    // false