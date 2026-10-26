import type { MappedValues } from "./types";

export const arraify = <T>(input: T | T[] | undefined): T[] =>
	input === undefined ? [] : Array.isArray(input) ? input : [input];

export const isNonNullish = <T>(input: T | undefined | null): input is T =>
	input !== null && input !== undefined;

export const mapValues = <T extends object, Value>(
	data: T,
	valueMapper: (value: T[keyof T], key: keyof T, data: T) => Value,
): MappedValues<T, Value> =>
	// @ts-expect-error We're not going to fix types, that'a a copy from remeda
	Object.fromEntries(
		Object.entries(data).map(([key, value]) => [
			key,
			valueMapper(value as T[keyof T], key as keyof T, data),
		]),
	);

export const omitBy = <T extends object>(
	data: T,
	predicate: (value: T[keyof T], key: keyof T, data: T) => boolean,
): T =>
	// @ts-expect-error We're not going to fix types, that'a a copy from remeda
	Object.fromEntries(
		Object.entries(data).filter(
			([key, value]) => !predicate(value as T[keyof T], key as keyof T, data),
		),
	);
