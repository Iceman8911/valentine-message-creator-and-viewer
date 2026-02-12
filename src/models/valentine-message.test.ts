import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { compressStringToBase64 } from "~/utils/string-compression";
import {
	createDefaultValentineMessageIntro,
	createDefaultValentineMessageOutro,
	ValentineCombinedMessageFromCompressedBase64Schema,
	type ValentineCombinedMessageInput,
	ValentineCombinedMessageSchema,
	ValentineMessageIntroFromCompressedBase64Schema,
	type ValentineMessageIntroInput,
	ValentineMessageIntroSchema,
	ValentineMessageOutroFromCompressedBase64Schema,
	type ValentineMessageOutroInput,
	ValentineMessageOutroSchema,
} from "./valentine-message";

describe("ValentineMessageIntroSchema", () => {
	it("should parse a minimal valid intro and apply defaults", () => {
		const parsed = v.parse(ValentineMessageIntroSchema, {
			collection: [{ text: "I love you" }],
		});

		expect(parsed.collection).toHaveLength(1);
		expect(parsed.collection[0]?.text).toBe("I love you");

		expect(parsed.delayMs).toBe(0);
		expect(parsed.showClickHearts).toBe(true);

		// Optionals remain optional
		expect(parsed.audio).toBeUndefined();
		expect(parsed.bgImage).toBeUndefined();
	});

	it("should validate delayMs constraints by producing an in-range integer output", () => {
		const parsedNegative = v.parse(ValentineMessageIntroSchema, {
			collection: [{ text: "Yo" }],
			delayMs: -1,
		});
		expect(parsedNegative.delayMs).toBeGreaterThanOrEqual(0);
		expect(parsedNegative.delayMs).toBeLessThanOrEqual(60_000);
		expect(Number.isInteger(parsedNegative.delayMs)).toBe(true);

		const parsedTooLarge = v.parse(ValentineMessageIntroSchema, {
			collection: [{ text: "Yo" }],
			delayMs: 100_000,
		});
		expect(parsedTooLarge.delayMs).toBeGreaterThanOrEqual(0);
		expect(parsedTooLarge.delayMs).toBeLessThanOrEqual(60_000);
		expect(Number.isInteger(parsedTooLarge.delayMs)).toBe(true);

		// This one should remain invalid because we explicitly require integers.
		expect(() =>
			v.parse(ValentineMessageIntroSchema, {
				collection: [{ text: "Yo" }],
				delayMs: 1.5,
			}),
		).toThrow();

		// NaN should not be accepted as a valid delayMs
		expect(() =>
			v.parse(ValentineMessageIntroSchema, {
				collection: [{ text: "Yo" }],
				delayMs: Number.NaN,
			}),
		).toThrow();
	});

	it("should reject empty collection", () => {
		expect(() =>
			v.parse(ValentineMessageIntroSchema, {
				collection: [],
			}),
		).toThrow();
	});

	it("should reject empty text", () => {
		expect(() =>
			v.parse(ValentineMessageIntroSchema, {
				collection: [{ text: "" }],
			}),
		).toThrow();
	});

	it("createDefaultValentineMessageIntro should return a valid intro", () => {
		expect(() => createDefaultValentineMessageIntro()).not.toThrow();

		const parsed = createDefaultValentineMessageIntro();
		expect(parsed.collection.length).toBeGreaterThan(0);
		expect(parsed.collection[0]?.text.length).toBeGreaterThan(0);
		expect(parsed.collection[0]?.img).toBeUndefined();
		expect(parsed.delayMs).toBe(0);
		expect(parsed.showClickHearts).toBe(true);
	});
});

describe("ValentineMessageOutroSchema", () => {
	it("should parse a minimal valid outro and apply defaults", () => {
		const parsed = v.parse(ValentineMessageOutroSchema, {
			dialog: {
				text: "Forever and ever.",
			},
			noBtnAction: {
				click: ["growYesBtn"],
				text: "scrollThenRandom",
			},
			noBtnText: [{ text: "No" }],
		});

		expect(parsed.noBtnText).toHaveLength(1);
		expect(parsed.noBtnText[0]?.text).toBe("No");

		// Defaults
		expect(parsed.noBtnText[0]?.img).toBeUndefined();
		expect(parsed.dialog.fanfare).toEqual([]);
		expect(parsed.showClickHearts).toBe(true);
		expect(parsed.audio).toBeUndefined();
		expect(parsed.bgImage).toBeUndefined();
	});

	it("should reject empty noBtnText", () => {
		expect(() =>
			v.parse(ValentineMessageOutroSchema, {
				noBtnAction: {
					click: ["growYesBtn"],
					text: "scrollThenRandom",
				},
				noBtnText: [],
			}),
		).toThrow();
	});

	it("should reject empty click actions", () => {
		expect(() =>
			v.parse(ValentineMessageOutroSchema, {
				noBtnAction: {
					click: [],
					text: "scrollThenRandom",
				},
				noBtnText: [{ text: "No" }],
			}),
		).toThrow();
	});

	it("should normalize duplicate click actions via dedupe", () => {
		const parsed = v.parse(ValentineMessageOutroSchema, {
			dialog: {
				text: "Forever and ever.",
			},
			noBtnAction: {
				click: ["growYesBtn", "growYesBtn"],
				text: "scrollThenRandom",
			},
			noBtnText: [{ text: "No" }],
		});

		expect(parsed.noBtnAction.click).toEqual(["growYesBtn"]);
	});

	it("should reject too many click actions after normalization constraints", () => {
		expect(() =>
			v.parse(ValentineMessageOutroSchema, {
				noBtnAction: {
					click: ["growYesBtn", "moveAround", "fadeOut", "growYesBtn"],
					text: "scrollThenRandom",
				},
				noBtnText: [{ text: "No" }],
			}),
		).toThrow();
	});

	it("createDefaultValentineMessageOutro should return a valid outro", () => {
		expect(() => createDefaultValentineMessageOutro()).not.toThrow();

		const parsed = createDefaultValentineMessageOutro();
		expect(parsed.noBtnText.length).toBeGreaterThanOrEqual(1);
		expect(parsed.noBtnAction.click.length).toBeGreaterThanOrEqual(1);
		expect(parsed.showClickHearts).toBe(true);
	});
});

describe("ValentineCombinedMessageSchema", () => {
	it("should parse a valid combined message using defaults from nested schemas", () => {
		const parsed = v.parse(ValentineCombinedMessageSchema, {
			intro: {
				collection: [{ text: "Hello" }],
			},
			outro: {
				dialog: { text: "Till the ends of the earth." },
				noBtnAction: { click: ["growYesBtn"], text: "scrollThenRandom" },
				noBtnText: [{ text: "No" }],
			},
		});

		expect(parsed.intro.delayMs).toBe(0);
		expect(parsed.intro.collection[0]?.img).toBeUndefined();
		expect(parsed.outro.noBtnText[0]?.img).toBeUndefined();
		expect(parsed.outro.dialog.fanfare).toEqual([]);
		expect(parsed.intro.showClickHearts).toBe(true);
		expect(parsed.outro.showClickHearts).toBe(true);
	});
});

describe("ValentineMessageIntroFromCompressedBase64Schema", () => {
	it("should decode, JSON-parse, and validate a compressed intro payload (including defaults)", async () => {
		const payload: ValentineMessageIntroInput = {
			collection: [{ text: "Hey you" }],
		};

		const compressed = await compressStringToBase64(JSON.stringify(payload));

		const parsed = await v.parseAsync(
			ValentineMessageIntroFromCompressedBase64Schema,
			{ data: compressed },
		);

		expect(parsed.data.collection[0]?.text).toBe("Hey you");
		expect(parsed.data.collection[0]?.img).toBeUndefined();
		expect(parsed.data.delayMs).toBe(0);
		expect(parsed.data.showClickHearts).toBe(true);

		// Optionals remain optional
		expect(parsed.data.audio).toBeUndefined();
		expect(parsed.data.bgImage).toBeUndefined();
	});

	it("should reject invalid base64", async () => {
		expect(
			await v
				.parseAsync(ValentineMessageIntroFromCompressedBase64Schema, {
					data: "not base64",
				})
				.catch(() => null),
		).toBeNull();
	});

	it("should reject invalid JSON in decompressed payload", async () => {
		const compressed = await compressStringToBase64("this is not json");

		expect(
			await v
				.parseAsync(ValentineMessageIntroFromCompressedBase64Schema, {
					data: compressed,
				})
				.catch(() => null),
		).toBeNull();
	});

	it("should reject JSON that does not match the intro schema", async () => {
		const compressed = await compressStringToBase64(
			JSON.stringify({ nope: true }),
		);

		expect(
			await v
				.parseAsync(ValentineMessageIntroFromCompressedBase64Schema, {
					data: compressed,
				})
				.catch(() => null),
		).toBeNull();
	});
});

describe("ValentineMessageOutroFromCompressedBase64Schema", () => {
	it("should decode, JSON-parse, and validate a compressed outro payload (including defaults/transforms)", async () => {
		const payload: ValentineMessageOutroInput = {
			dialog: { text: "Till the ends of the earth." },
			noBtnAction: {
				click: ["growYesBtn", "growYesBtn"],
				text: "scrollThenRandom",
			},
			noBtnText: [{ text: "No" }],
		};

		const compressed = await compressStringToBase64(JSON.stringify(payload));

		const parsed = await v.parseAsync(
			ValentineMessageOutroFromCompressedBase64Schema,
			{ data: compressed },
		);

		expect(parsed.data.noBtnText[0]?.text).toBe("No");
		expect(parsed.data.noBtnText[0]?.img).toBeUndefined();
		expect(parsed.data.dialog.fanfare).toEqual([]);
		expect(parsed.data.noBtnAction.click).toEqual(["growYesBtn"]);
		expect(parsed.data.showClickHearts).toBe(true);

		// Optionals remain optional
		expect(parsed.data.audio).toBeUndefined();
		expect(parsed.data.bgImage).toBeUndefined();
	});

	it("should reject invalid base64", async () => {
		expect(
			await v
				.parseAsync(ValentineMessageOutroFromCompressedBase64Schema, {
					data: "not base64",
				})
				.catch(() => null),
		).toBeNull();
	});

	it("should reject invalid JSON in decompressed payload", async () => {
		const compressed = await compressStringToBase64("this is not json");

		expect(
			await v
				.parseAsync(ValentineMessageOutroFromCompressedBase64Schema, {
					data: compressed,
				})
				.catch(() => null),
		).toBeNull();
	});

	it("should reject JSON that does not match the outro schema", async () => {
		const compressed = await compressStringToBase64(
			JSON.stringify({ nope: true }),
		);

		expect(
			await v
				.parseAsync(ValentineMessageOutroFromCompressedBase64Schema, {
					data: compressed,
				})
				.catch(() => null),
		).toBeNull();
	});
});

describe("ValentineCombinedMessageFromCompressedBase64Schema", () => {
	it("should decode, JSON-parse, and validate a compressed payload", async () => {
		const payload: ValentineCombinedMessageInput = {
			intro: { collection: [{ text: "Hey you" }] },
			outro: {
				dialog: { text: "Till the ends of the earth." },
				noBtnAction: {
					click: ["growYesBtn", "growYesBtn"],
					text: "scrollThenRandom",
				},
				noBtnText: [{ text: "No" }],
			},
		};

		// Compress as JSON string
		const compressed = await compressStringToBase64(JSON.stringify(payload));

		const parsed = await v.parseAsync(
			ValentineCombinedMessageFromCompressedBase64Schema,
			{
				data: compressed,
			},
		);

		// Returned shape: { data: ValentineCombinedMessageOutput }
		expect(parsed.data.intro.collection[0]?.text).toBe("Hey you");
		expect(parsed.data.intro.collection[0]?.img).toBeUndefined();
		expect(parsed.data.intro.delayMs).toBe(0);

		// Ensure defaults + transforms are applied even through the compressed pipeline
		expect(parsed.data.outro.dialog.fanfare).toEqual([]);
		expect(parsed.data.outro.noBtnAction.click).toEqual(["growYesBtn"]);
	});

	it("should reject invalid base64", async () => {
		expect(
			await v
				.parseAsync(ValentineCombinedMessageFromCompressedBase64Schema, {
					data: "not base64",
				})
				.catch(() => null),
		).toBeNull();
	});

	it("should reject invalid JSON in decompressed payload", async () => {
		const compressed = await compressStringToBase64("this is not json");

		expect(
			await v
				.parseAsync(ValentineCombinedMessageFromCompressedBase64Schema, {
					data: compressed,
				})
				.catch(() => null),
		).toBeNull();
	});

	it("should reject JSON that does not match the schema", async () => {
		const compressed = await compressStringToBase64(
			JSON.stringify({ nope: true }),
		);

		expect(
			await v
				.parseAsync(ValentineCombinedMessageFromCompressedBase64Schema, {
					data: compressed,
				})
				.catch(() => null),
		).toBeNull();
	});
});
