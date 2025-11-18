// Array and Tuple Comparisons
//
// This module demonstrates type relationships between
// arrays, tuples, and array-like structures.

import type { $Equal, $Extends } from './basic-comparisons';

// === Basic Array Types ===

export type NumberArray = number[];
export type StringArray = string[];
export type AnyArray = any[];
export type ReadonlyNumberArray = readonly number[];

// === Tuple Types ===

export type MixedTuple = [string, number];
export type NumberTuple = [number, number];
export type EmptyTuple = [];
export type SingletonTuple = [string];
export type VariableTuple = [string, ...number[]];

// === Array Relationships ===

export type NumberArrayExtendsArray = $Extends<NumberArray, any[]>;                      // true
export type StringArrayExtendsNumberArray = $Extends<StringArray, NumberArray>;         // false
export type ArrayExtendsReadonlyArray = $Extends<number[], readonly number[]>;          // true
export type ReadonlyArrayExtendsArray = $Extends<readonly number[], number[]>;          // false

// === Tuple vs Array Relationships ===

export type TupleExtendsArray = $Extends<MixedTuple, any[]>;                            // true
export type ArrayExtendsTuple = $Extends<any[], MixedTuple>;                            // false (arrays are less specific)
export type TupleExtendsReadonlyArray = $Extends<[string, number], readonly any[]>;     // true

// === Tuple Length Relationships ===

export type EmptyExtendsAnyTuple = $Extends<[], [any, ...any[]]>;                      // false
export type SingletonExtendsEmpty = $Extends<[string], []>;                            // false
export type LongerExtendsSpecific = $Extends<[string, number, boolean], [string, number]>; // false

// === Tuple Element Relationships ===

export type SpecificTupleExtendsGeneral = $Extends<[string, number], [any, any]>;      // true
export type GeneralTupleExtendsSpecific = $Extends<[any, any], [string, number]>;     // false

// === Variable Length Tuples ===

export type RestTupleExtendsArray = $Extends<[string, ...number[]], any[]>;            // true
export type FixedExtendsRestTuple = $Extends<[string, number, number], [string, ...number[]]>; // true
export type RestTupleExtendsFixed = $Extends<[string, ...number[]], [string, number]>; // false

// === Named Tuple Elements (TypeScript 4.0+) ===

export type NamedTuple = [id: string, count: number];
export type UnnamedTuple = [string, number];

export type NamedExtendsUnnamed = $Extends<NamedTuple, UnnamedTuple>;                  // true
export type UnnamedExtendsNamed = $Extends<UnnamedTuple, NamedTuple>;                  // true

// === Array Methods and Properties ===

export interface ArrayLike<T> {
  readonly length: number;
  readonly [n: number]: T;
}

export type TupleExtendsArrayLike = $Extends<[string, number], ArrayLike<string | number>>; // true
export type ArrayExtendsArrayLike = $Extends<string[], ArrayLike<string>>;             // true

// === Complex Array Types ===

export type NestedArray = number[][];
export type JaggedArray = (string | number)[][];
export type MixedNestedArray = [string[], number[]];

export type NestedExtendsArray = $Extends<NestedArray, any[]>;                         // true
export type MixedNestedExtendsTuple = $Extends<MixedNestedArray, [any[], any[]]>;      // true

// === Array Equality ===

export type SameArrayType = $Equal<string[], string[]>;                                // true
export type DifferentArrayTypes = $Equal<string[], number[]>;                          // false
export type SameTupleType = $Equal<[string, number], [string, number]>;               // true
export type DifferentTupleOrder = $Equal<[string, number], [number, string]>;         // false

// === Practical Examples ===

// Coordinate system
export type Point2D = [x: number, y: number];
export type Point3D = [x: number, y: number, z: number];
export type Vector = number[];

export type Point3DExtendsPoint2D = $Extends<Point3D, Point2D>;                       // false
export type Point2DExtendsVector = $Extends<Point2D, Vector>;                         // true

// RGB Color system
export type RGB = [red: number, green: number, blue: number];
export type RGBA = [red: number, green: number, blue: number, alpha: number];
export type ColorArray = number[];

export type RGBAExtendsRGB = $Extends<RGBA, RGB>;                                     // false
export type RGBExtendsColorArray = $Extends<RGB, ColorArray>;                         // true

console.log('✅ Array and tuple relationships demonstrate structural variance');