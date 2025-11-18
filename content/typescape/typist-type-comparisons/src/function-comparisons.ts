// Function Type Comparisons
//
// This module demonstrates function type relationships,
// including parameter and return type variance.

import type { $Equal, $Extends } from './basic-comparisons';

// === Function Type Definitions ===

export type SimpleFunc = (x: number) => string;
export type GenericFunc = <T>(x: T) => T;
export type VoidFunc = () => void;
export type OptionalParamFunc = (x?: number) => string;
export type RestParamFunc = (...args: number[]) => string;

// === Function Assignability ===

// Function assignability follows contravariance for parameters and covariance for return types
export type SimpleFuncExtendsFuncWithAny = $Extends<SimpleFunc, (x: any) => string>;     // true
export type FuncWithAnyExtendsSimpleFunc = $Extends<(x: any) => string, SimpleFunc>;     // false

// Parameter contravariance: more general parameters can accept more specific functions
export type SpecificToGeneral = $Extends<(x: string) => void, (x: any) => void>;         // true
export type GeneralToSpecific = $Extends<(x: any) => void, (x: string) => void>;         // false

// Return type covariance: more specific return types can be assigned to more general ones
export type SpecificReturn = $Extends<() => string, () => any>;                          // true
export type GeneralReturn = $Extends<() => any, () => string>;                           // false

// === Void and Undefined ===

export type VoidExtendsUndefined = $Extends<VoidFunc, () => undefined>;                  // true (void is assignable to undefined)
export type UndefinedExtendsVoid = $Extends<() => undefined, VoidFunc>;                  // true (undefined is assignable to void)

// === Optional Parameters ===

export type RequiredExtendsOptional = $Extends<(x: number) => void, (x?: number) => void>;  // true
export type OptionalExtendsRequired = $Extends<(x?: number) => void, (x: number) => void>;  // false

// === Rest Parameters ===

export type FixedExtendsRest = $Extends<(a: number, b: number) => void, (...args: number[]) => void>;  // true
export type RestExtendsFixed = $Extends<(...args: number[]) => void, (a: number, b: number) => void>;  // false

// === Method vs Function ===

export interface HasMethod {
  method(x: number): string;
}

export interface HasFunction {
  method: (x: number) => string;
}

export type MethodExtendsFunction = $Extends<HasMethod, HasFunction>;    // true
export type FunctionExtendsMethod = $Extends<HasFunction, HasMethod>;    // true

// === Overloaded Functions ===

export interface Overloaded {
  (x: string): string;
  (x: number): number;
}

export type SingleFunc = (x: string) => string;

export type OverloadedExtendsSingle = $Extends<Overloaded, SingleFunc>;  // true (can handle string case)
export type SingleExtendsOverloaded = $Extends<SingleFunc, Overloaded>;  // false (can't handle number case)

// === Higher-Order Functions ===

export type MapFunc<T, U> = (arr: T[], mapper: (item: T) => U) => U[];
export type FilterFunc<T> = (arr: T[], predicate: (item: T) => boolean) => T[];

export type StringMapFunc = MapFunc<string, number>;
export type NumberFilterFunc = FilterFunc<number>;

// === Function Equality ===

export type SameFunctionSignature = $Equal<(x: number) => string, (x: number) => string>;  // true
export type DifferentParamNames = $Equal<(x: number) => string, (y: number) => string>;     // true (param names don't matter)
export type DifferentParamTypes = $Equal<(x: number) => string, (x: string) => string>;     // false

console.log('✅ Function type comparisons show parameter/return variance');