import * as v from "valibot";
import { dedupeArray } from "~/utils/array";
import { decompressBase64ToString } from "~/utils/string-compression";
import { NonEmptyTextSchema, UrlStringSchema } from "./shared";

const VALENTINE_MESSAGE_INTRO_SEGMENT_MAX_IMAGES = 3;

const ValentineMessageTextAndImageSegment = v.object({
	/** Up to 3 images / gifs to show while the text is onscreen */
	imgs: v.optional(
		v.pipe(
			v.array(UrlStringSchema),
			v.maxLength(
				VALENTINE_MESSAGE_INTRO_SEGMENT_MAX_IMAGES,
				`Only a maximum of ${VALENTINE_MESSAGE_INTRO_SEGMENT_MAX_IMAGES} images can be created`,
			),
		),
		[],
	),
	text: NonEmptyTextSchema,
});

const SharedIntroAndOutroSchema = v.object({
	/** Optional audio to play while the collection plays */
	audio: v.optional(UrlStringSchema),

	/** Link to the background image */
	bgImage: v.optional(UrlStringSchema),

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
		v.pipe(v.number(), v.integer(), v.toMinValue(0), v.toMaxValue(60_000)),
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

export const ValentineMessageOutroSchema = v.object({
	...SharedIntroAndOutroSchema.entries,

	/** Characteristics of the final dialog that will appear after the user clicks the yes button. */
	dialog: v.object({
		fanfare: (() => {
			const picklist = v.picklist(["hearts", "confetti"]);
			const maxLength = picklist.options.length;

			return v.optional(
				v.pipe(
					v.array(picklist),
					v.transform(dedupeArray),
					v.maxLength(maxLength, "Too many fanfare options"),
				),
				[],
			);
		})(),
		text: NonEmptyTextSchema,
	}),

	/** What the "no button" should do when clicked */
	noBtnAction: v.object({
		/** When the "no button" is clicked, do a combination of:
		 *
		 * - `growYesBtn` -> make the yes button grow larger.
		 * - `moveAround` -> move to a random position onscreen with a transition.
		 * - `fadeOut` -> (???) fade the button's colours out till it's nearly transparent (but keep the text readable)
		 *
		 * If multiple of the same actions exist, only the first will have any effect.
		 */
		click: (() => {
			const picklist = v.picklist(["growYesBtn", "moveAround", "fadeOut"]);
			const { length } = picklist.options;

			return v.pipe(
				v.array(picklist),
				v.transform(dedupeArray),
				v.minLength(1, "At least an action is required."),
				v.maxLength(length, `Can't have more than ${length} click actions.`),
			);
		})(),
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
			text: "Till the ends of the earth.",
		},
		noBtnAction: {
			click: ["growYesBtn"],
			text: "scrollThenRandom",
		},
		noBtnText: [
			{
				imgs: [],
				text: "No",
			},
			{
				imgs: [],
				text: "No :(",
			},
		],
	};

	return v.parse(ValentineMessageOutroSchema, input);
}

export const ValentineCombinedMessageSchema = v.object({
	/** Introductory passages of text that will be played after each other, till the user has seen every one. */
	intro: ValentineMessageIntroSchema,

	outro: ValentineMessageOutroSchema,
});
export type ValentineCombinedMessageInput = v.InferInput<
	typeof ValentineCombinedMessageSchema
>;
export type ValentineCombinedMessageOutput = v.InferOutput<
	typeof ValentineCombinedMessageSchema
>;

export const ValentineCombinedMessageFromCompressedBase64Schema = v.objectAsync(
	{
		data: v.pipeAsync(
			v.string(),
			v.transformAsync(async (compressed) => {
				const decompressed = await decompressBase64ToString(compressed);

				return v.parse(
					v.pipe(
						v.string(),
						v.transform(JSON.parse),
						ValentineCombinedMessageSchema,
					),
					decompressed,
				);
			}),
		),
	},
);
export type ValentineCombinedMessageFromCompressedBase64Input = v.InferInput<
	typeof ValentineCombinedMessageFromCompressedBase64Schema
>;
export type ValentineCombinedMessageFromCompressedBase64Output = v.InferOutput<
	typeof ValentineCombinedMessageFromCompressedBase64Schema
>;
