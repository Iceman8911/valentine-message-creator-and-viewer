import * as v from "valibot";
import { describe, expect, it } from "vitest";
import {
	type NonEmptyTextOutput,
	NonEmptyTextSchema,
	type UrlStringOutput,
	UrlStringSchema,
} from "./shared";

describe("UrlStringSchema", () => {
	it("should validate regular url strings", () => {
		expect(() => v.parse(UrlStringSchema, "https://example.com")).not.toThrow();
		expect(() =>
			v.parse(UrlStringSchema, "http://example.com/path?x=1#hash"),
		).not.toThrow();
	});

	it("should brand the output type", () => {
		const url = v.parse(UrlStringSchema, "https://example.com");

		const acceptsBranded = (_value: UrlStringOutput) => _value;
		acceptsBranded(url);
	});

	it("should throw on invalid url strings", () => {
		expect(() => v.parse(UrlStringSchema, "")).toThrow();
		expect(() => v.parse(UrlStringSchema, "not a url")).toThrow();
		expect(() => v.parse(UrlStringSchema, "example.com")).toThrow();
	});
});

describe("NonEmptyTextSchema", () => {
	it("should validate non-empty text strings", () => {
		expect(() => v.parse(NonEmptyTextSchema, "Hello")).not.toThrow();
		expect(() => v.parse(NonEmptyTextSchema, "a")).not.toThrow();
	});

	it("should brand the output type", () => {
		const text = v.parse(NonEmptyTextSchema, "Hello");

		const acceptsBranded = (_value: NonEmptyTextOutput) => _value;
		acceptsBranded(text);
	});

	it("should throw on empty strings", () => {
		expect(() => v.parse(NonEmptyTextSchema, "")).toThrow();
	});

	it("should throw on overly long strings", () => {
		expect(() => v.parse(NonEmptyTextSchema, "a".repeat(257))).toThrow();
	});
});
