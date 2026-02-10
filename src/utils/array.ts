export function dedupeArray<TArrayElement>(
	arr: ReadonlyArray<TArrayElement>,
): Array<TArrayElement> {
	return [...new Set(arr)];
}
