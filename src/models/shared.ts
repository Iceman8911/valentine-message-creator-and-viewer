import * as v from "valibot";

export const UrlStringSchema = v.pipe(
	v.string(),
	v.url(),
	v.brand("url-string"),
);
export type UrlStringInput = v.InferInput<typeof UrlStringSchema>;
export type UrlStringOutput = v.InferOutput<typeof UrlStringSchema>;
export function createDefaultUrlString() {
	return v.parse(UrlStringSchema, "https://foo.bar");
}

export const NonEmptyTextSchema = v.pipe(
	v.string(),
	v.minLength(1, "Text is required."),
	v.maxLength(256, "Text is too long."),
	v.brand("non-empty-text"),
);
export type NonEmptyTextInput = v.InferInput<typeof NonEmptyTextSchema>;
export type NonEmptyTextOutput = v.InferOutput<typeof NonEmptyTextSchema>;
