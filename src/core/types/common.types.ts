import * as Constant from '@/core/constants/index.constant';

/**
 *  This general type is mainly used to create type from constant object.
 */
export type ObjectValues<T> = T[keyof T];

/**
 * Create a type that its value is set by some specific property value of that object (you have to pick it in a picky way ;) ).
 */
export type ObjectValuesPicky<T, K extends keyof T> = T[keyof Partial<
  Pick<T, K>
>];

/**
 * Create a type that its value is defined by value of sub property(S) belong to the property main constant
 */
export type SubObjectValues<T, S extends keyof T[keyof T]> = T[keyof T][S];

// Return a type that contains only ReadonlyArray items
export type ReadonlyArrayNonEmpty<T> = ReadonlyArray<T> & { readonly 0: T };

//  Return all key of a specific constant as value to create a new type
export type GetKeys<T> = keyof T;

//  Return the type of each item in an array
export type GetArrayObjectType<T> = T extends Array<infer U> ? U : never;

//  Return the type of each item in a readonly array
export type GetReadonlyArrayObjectType<T> =
  T extends ReadonlyArray<infer U> ? U : never;
//  Return the type of NON-EMPTY items in a constant ReadonlyArray
export type GetReadonlyArrayNonEmptyObjectType<T> =
  T extends ReadonlyArrayNonEmpty<infer U & { 0: infer X }> ? U : never;

//  Return the properties value of a constant
export type ExtractPropertiesFromObjectKeys<T> = keyof T[keyof T];

// ----------------
export type tLink = Constant.Link;
