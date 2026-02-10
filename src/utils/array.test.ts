import { describe, expect, it } from "vitest";
import { dedupeArray } from "./array";

describe(dedupeArray.name, () => {
	it("should dedupe arrays", () => {
		const duped = [1, 2, 4, 3, 3, 1] as const;

		const deduped = dedupeArray(duped);

		expect(deduped.sort()).toEqual([1, 2, 3, 4].sort());
	});

	it("should not affect already deduped arrays", () => {
		const deduped = [1, 2, 3, 4, 5];

		expect(dedupeArray(deduped)).toEqual(deduped);
	});
});
