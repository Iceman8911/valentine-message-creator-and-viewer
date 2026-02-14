import { getRandomIntegerInRangeInclusively } from "./number";

export function dedupeArray<TArrayElement>(
	arr: ReadonlyArray<TArrayElement>,
): Array<TArrayElement> {
	return [...new Set(arr)];
}

export function getRandomArrayElement<TArrayElement>(
	arr: ReadonlyArray<TArrayElement>,
): TArrayElement | undefined {
	return arr[getRandomIntegerInRangeInclusively(0, arr.length - 1)];
}
