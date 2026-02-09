import { assert, describe, expect, it } from "vitest";
import {
	compressStringToBase64,
	decompressBase64ToString,
} from "./string-compression";

const LONG_STR = Array.from({ length: 10_000 }, (_, i) => i * i).join("-");
const BASE64_REGEX = /^[A-Za-z0-9+/=]+$/;

function isBase64(str: string) {
	return BASE64_REGEX.test(str);
}

describe(compressStringToBase64.name, () => {
	it("should output safe base64 strings", async () => {
		const compressedStr = await compressStringToBase64(LONG_STR);

		expect(isBase64(compressedStr)).toBeTruthy();
	});

	it("should compress large strings to less than 40% the original size", async () => {
		const compressedStr = await compressStringToBase64(LONG_STR);

		const compressionPercentage =
			100 - (compressedStr.length / LONG_STR.length) * 100;

		expect(compressionPercentage).toBeGreaterThan(40);
	});

	it("should compress large strings within <50ms", async () => {
		const start = performance.now();
		await compressStringToBase64(LONG_STR);
		const end = performance.now();

		expect(end - start).toBeLessThan(50);
	});

	it("should always compress the same string the same way", async () => {
		const compressedStrings = new Set<string>();

		await Promise.all(
			Array.from({ length: 100 }, async () => {
				compressedStrings.add(
					await compressStringToBase64(compressStringToBase64.name),
				);
			}),
		);

		expect(compressedStrings.size).toBe(1);
	});

	it("should compress 'edge-case' strings", async () => {
		expect(await compressStringToBase64("").catch((_) => null)).not.toBeNull();

		expect(await compressStringToBase64("a").catch((_) => null)).not.toBeNull();

		expect(
			await compressStringToBase64("hello").catch((_) => null),
		).not.toBeNull();

		expect(
			await compressStringToBase64("💖 café 你好").catch((_) => null),
		).not.toBeNull();
	});
});

describe(decompressBase64ToString.name, () => {
	it("should decompress compressed strings to their original value", async () => {
		const compressedStr = await compressStringToBase64(LONG_STR);

		const decompressedStr = await decompressBase64ToString(compressedStr);

		expect(decompressedStr).toBe(LONG_STR);
	});

	it("should throw on invalid compressed strings", async () => {
		expect(
			await decompressBase64ToString("not base64").catch((_) => null),
		).toBeNull();

		expect(
			await decompressBase64ToString("@@@=").catch((_) => null),
		).toBeNull();
	});

	it("should decompress non-ASCII strings", async () => {
		expect(
			await decompressBase64ToString(
				await compressStringToBase64("💖 café 你好"),
			),
		).toBe("💖 café 你好");
	});
});
