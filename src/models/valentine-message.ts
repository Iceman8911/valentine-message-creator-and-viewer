import * as v from "valibot";
import {
	compressStringToBase64,
	decompressBase64ToString,
} from "~/utils/string-compression";
import {
	MAX_DELAY_MS_VALUE,
	MIN_DELAY_MS_VALUE,
} from "../components/constants/model-limits";
import { NonEmptyTextSchema, UrlStringSchema } from "./shared";

const OptionalUrlStringSchema = v.optional(
	v.union([
		UrlStringSchema,
		v.pipe(
			v.literal(""),
			v.transform(() => undefined),
		),
	]),
);

const ValentineMessageTextAndImageSegment = v.object({
	/** An image / gif to show while the text is onscreen */
	img: OptionalUrlStringSchema,
	text: NonEmptyTextSchema,
});

const SharedIntroAndOutroSchema = v.object({
	/** Optional audio to play while the collection plays */
	audio: OptionalUrlStringSchema,

	/** Link to the background image */
	bgImage: OptionalUrlStringSchema,

	/** Display a heart / bubbly animation wherever the user click on screen */
	showClickHearts: v.optional(v.boolean(), true),
});

export const ValentineMessageIntroSchema = v.object({
	...SharedIntroAndOutroSchema.entries,

	/** Collection of texts and images/gifs to play through */
	collection: v.pipe(
		v.array(ValentineMessageTextAndImageSegment),
		v.minLength(1, "At least a blurb of text is required."),
		v.maxLength(128, "Way too many texts in the collection"),
	),

	/** Optional delay to wait for before auto-playing the next segment.
	 *
	 *  A delay of 0 means that segments will not be auto-played.
	 */
	delayMs: v.optional(
		v.pipe(
			v.union([v.string(), v.number()]),
			v.toNumber(),
			v.integer(),
			v.toMinValue(MIN_DELAY_MS_VALUE),
			v.toMaxValue(MAX_DELAY_MS_VALUE),
		),
		0,
	),
});
export type ValentineMessageIntroInput = v.InferInput<
	typeof ValentineMessageIntroSchema
>;
export type ValentineMessageIntroOutput = v.InferOutput<
	typeof ValentineMessageIntroSchema
>;
export function createDefaultValentineMessageIntro(): ValentineMessageIntroOutput {
	const input: ValentineMessageIntroInput = {
		collection: [{ text: "I love you :3" }],
	};

	return v.parse(ValentineMessageIntroSchema, input);
}

const OptionalBooleanSchema = v.optional(v.boolean(), false);

export const ValentineMessageOutroSchema = v.object({
	...SharedIntroAndOutroSchema.entries,

	/** Characteristics of the final dialog that will appear after the user clicks the yes button. */
	dialog: v.object({
		fanfare: v.optional(
			v.object({
				confetti: OptionalBooleanSchema,
				hearts: OptionalBooleanSchema,
			}),
		),

		img: OptionalUrlStringSchema,
		text: NonEmptyTextSchema,

		title: v.optional(NonEmptyTextSchema, "Will you be my valentine? :3"),
	}),

	/** What the "no button" should do when clicked */
	noBtnAction: v.object({
		/** When the "no button" is clicked, do a combination of:
		 *
		 * - `growYesBtn` -> make the yes button grow larger.
		 * - `moveAround` -> move to a random position onscreen with a transition.
		 * - `fadeOut` -> (???) fade the button's colours out till it's nearly transparent (but keep the text readable)
		 */
		click: v.optional(
			v.object({
				fadeOut: OptionalBooleanSchema,
				growYesBtn: OptionalBooleanSchema,
				moveAround: OptionalBooleanSchema,
			}),
		),
		/** When the "no button" is clicked:
		 *
		 * - `random` -> randomly display text. Does not ever stop.
		 * - `scroll` -> alternate through the text in added order. Stops when all text has been shown once.
		 * - `scrollThenRandom` -> `scroll` until all text has been shown at least once, then switch to `random`
		 */
		text: v.picklist(["random", "scroll", "scrollThenRandom"]),
	}),

	/** An array of strings and gifs to show on the "no" btn and alternate through as the user clicks it */
	noBtnText: v.pipe(
		v.array(ValentineMessageTextAndImageSegment),
		v.minLength(1, "At least add some text like 'No'."),
		v.maxLength(32, "Too many button captions."),
	),
});
export type ValentineMessageOutroInput = v.InferInput<
	typeof ValentineMessageOutroSchema
>;
export type ValentineMessageOutroOutput = v.InferOutput<
	typeof ValentineMessageOutroSchema
>;
export function createDefaultValentineMessageOutro(): ValentineMessageOutroOutput {
	const input: ValentineMessageOutroInput = {
		dialog: {
			fanfare: {
				hearts: true,
			},
			text: "Till the ends of the earth.",
		},
		noBtnAction: {
			click: {
				growYesBtn: true,
			},
			text: "scrollThenRandom",
		},
		noBtnText: [
			{
				text: "No",
			},
			{
				text: "No :(",
			},
		],
	};

	return v.parse(ValentineMessageOutroSchema, input);
}

export const ValentineCombinedMessageSchema = v.object({
	/** Introductory passages of text that will be played after each other, till the user has seen every one. */
	intro: v.optional(
		ValentineMessageIntroSchema,
		createDefaultValentineMessageIntro(),
	),

	/** Yes or no section :3 */
	outro: v.optional(
		ValentineMessageOutroSchema,
		createDefaultValentineMessageOutro(),
	),
});
export type ValentineCombinedMessageInput = v.InferInput<
	typeof ValentineCombinedMessageSchema
>;
export type ValentineCombinedMessageOutput = v.InferOutput<
	typeof ValentineCombinedMessageSchema
>;

export function createDefaultCombinedValentineMessage() {
	const input: ValentineCombinedMessageInput = {};

	return v.parse(ValentineCombinedMessageSchema, input);
}

export const ValentineCombinedMessageFromCompressedBase64Schema =
	v.fallbackAsync(
		v.pipeAsync(
			v.string("Expected a compressed string"),
			v.base64(),
			v.transformAsync(decompressBase64ToString),
			v.parseJson(),
			ValentineCombinedMessageSchema,
		),
		createDefaultCombinedValentineMessage(),
	);
export type ValentineCombinedMessageFromCompressedBase64Input = v.InferInput<
	typeof ValentineCombinedMessageFromCompressedBase64Schema
>;
export type ValentineCombinedMessageFromCompressedBase64Output = v.InferOutput<
	typeof ValentineCombinedMessageFromCompressedBase64Schema
>;

export const ValentineCombinedMessageToCompressedBase64Schema = v.pipeAsync(
	ValentineCombinedMessageSchema,
	v.stringifyJson(),
	v.transformAsync(compressStringToBase64),
	v.base64("Expected a compressed base64 string"),
);
export type ValentineCombinedMessageToCompressedBase64Input = v.InferInput<
	typeof ValentineCombinedMessageToCompressedBase64Schema
>;
export type ValentineCombinedMessageToCompressedBase64Output = v.InferOutput<
	typeof ValentineCombinedMessageToCompressedBase64Schema
>;

export const ValentineMessageSearchParamsSchema = v.fallback(
	v.object({
		/** The stringified representation of the combined valentine schema */
		data: v.string(),
	}),
	{
		data: "",
	},
);
export type ValentineMessageSearchParamsInput = v.InferInput<
	typeof ValentineMessageSearchParamsSchema
>;
export type ValentineMessageSearchParamsOutput = v.InferOutput<
	typeof ValentineMessageSearchParamsSchema
>;
