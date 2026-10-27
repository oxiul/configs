import { isNonNullish, unique } from "remeda";

export const uniqueNonNullish = <T>(
	values: readonly (T | null | undefined)[],
): T[] => unique(values.filter(isNonNullish));

export const sum = (values: readonly number[]): number =>
	values.reduce((total, value) => total + value, 0);
