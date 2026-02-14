import { describe, expect, expectTypeOf, it } from "vitest";
import type { UrlStringOutput } from "../models/shared";
import { createDefaultCombinedValentineMessage } from "../models/valentine-message";
import { getValentineMessageViewLink } from "./valentine-message";

describe(getValentineMessageViewLink.name, () => {
	it("should return a valid url with data stored as search parameters", async () => {
		const link = await getValentineMessageViewLink(
			createDefaultCombinedValentineMessage(),
			"http://localhost:3000",
		);

		expectTypeOf(link).toExtend<UrlStringOutput>();

		expect([...new URL(link).searchParams.entries()].length > 0).toBeTruthy();
	});
});
