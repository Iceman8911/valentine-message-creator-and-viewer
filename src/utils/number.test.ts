import { describe, expect, it } from "vitest";
import { getRandomIntegerInRangeInclusively } from "./number";

describe(getRandomIntegerInRangeInclusively.name, () => {
	it("should return a random integer between the given ranges inclusively", () => {
		const MIN = 1,
			MAX = 100;

		for (let i = 0; i < 100; i++) {
			const int = getRandomIntegerInRangeInclusively(MIN, MAX);

			expect(int).toBeGreaterThanOrEqual(MIN);
			expect(int).toBeLessThanOrEqual(MAX);
		}
	});
});
