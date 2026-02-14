import * as formisch from "@formisch/solid";
import { createAsync, useNavigate } from "@solidjs/router";
import { PlusIcon, Trash2Icon } from "lucide-solid";
import { For } from "solid-js";
import * as v from "valibot";
import {
	createDefaultValentineMessageIntro,
	type ValentineCombinedMessageFromCompressedBase64Input,
	ValentineCombinedMessageFromCompressedBase64Schema,
	type ValentineMessageIntroInput,
	type ValentineMessageIntroOutput,
	ValentineMessageIntroSchema,
} from "~/models/valentine-message";
import { compressStringToBase64 } from "~/utils/string-compression";
import {
	MAX_DELAY_MS_VALUE,
	MIN_DELAY_MS_VALUE,
} from "../constants/model-limits";
import BaseButton from "../ui/BaseButton";
import FieldsetNumberInput from "../ui/form-fields/FieldsetNumberInput";
import FieldsetTextInput from "../ui/form-fields/FieldsetTextInput";
import FieldsetToggleInput from "../ui/form-fields/FieldsetToggleInput";
import FloatingLabelTextInput from "../ui/form-fields/FloatingLabelTextInput";
import InfoButtonPopover from "../ui/InfoButtonPopover";
import type { _ValentineMessageCreationFormSharedProps } from "./shared";

function ValentineMessageIntroHeader() {
	return (
		<div class="mb-4 space-y-2 sm:col-span-2">
			<h2 class="font-semibold">Valentine Message Intro</h2>

			<p class="text-sm">Type out what you wanna say to your bae / boo :3</p>
		</div>
	);
}

interface FieldProps {
	form: formisch.FormStore<typeof ValentineMessageIntroSchema>;
}

function AudioField(props: FieldProps) {
	return (
		<formisch.Field of={props.form} path={["audio"]}>
			{(field) => (
				<FieldsetTextInput
					{...field.props}
					errors={field.errors}
					infoPopover={{
						description:
							"A link to an online audio asset that should play in the background while the user views the message.",
						title: "Audio Link",
					}}
					input={field.input}
					legend="Audio Link"
					placeholder="https://www.example.com/1.ogg"
					type="text"
				/>
			)}
		</formisch.Field>
	);
}

function BgImageField(props: FieldProps) {
	return (
		<formisch.Field of={props.form} path={["bgImage"]}>
			{(field) => (
				<FieldsetTextInput
					{...field.props}
					errors={field.errors}
					infoPopover={{
						description:
							"A link to an online image asset to replace the default background.",
						title: "Background Image Link",
					}}
					input={field.input}
					legend="Background Image Link"
					placeholder="https://www.example.com/1.png"
					type="text"
				/>
			)}
		</formisch.Field>
	);
}

function ShowClickHeartsField(props: FieldProps) {
	return (
		<formisch.Field of={props.form} path={["showClickHearts"]}>
			{(field) => (
				<FieldsetToggleInput
					{...field.props}
					errors={field.errors}
					infoPopover={{
						description:
							"Play a cute heart animation wherever the screen is clicked.",
						title: "Show Heart Animation on Click",
					}}
					input={field.input}
					legend="Show Heart Animation on Click"
				/>
			)}
		</formisch.Field>
	);
}

function DelayDurationField(props: FieldProps) {
	return (
		<formisch.Field of={props.form} path={["delayMs"]}>
			{(field) => (
				<FieldsetNumberInput
					{...field.props}
					errors={field.errors}
					infoPopover={{
						description:
							"How long, in milliseconds, a passage is played before automatically advancing to the next. A value of '0' disables this behaviour.",
						title: "Delay",
					}}
					input={field.input}
					legend="Delay (in milliseconds)"
					max={MAX_DELAY_MS_VALUE}
					min={MIN_DELAY_MS_VALUE}
				/>
			)}
		</formisch.Field>
	);
}

interface PassageCollectionFieldProps extends FieldProps {
	idx: number;
}

function PassageCollectionFieldText(props: PassageCollectionFieldProps) {
	return (
		<formisch.Field of={props.form} path={["collection", props.idx, "text"]}>
			{(field) => (
				<FloatingLabelTextInput
					{...field.props}
					errors={field.errors}
					input={field.input}
					label="Passage"
					placeholder="I love you :3"
					required={true}
					type="text"
				/>
			)}
		</formisch.Field>
	);
}

function PassageCollectionFieldImgs(props: PassageCollectionFieldProps) {
	return (
		<formisch.Field of={props.form} path={["collection", props.idx, "img"]}>
			{(field) => (
				<FloatingLabelTextInput
					{...field.props}
					errors={field.errors}
					input={field.input}
					label="Image / Gif Link"
					placeholder="https://www.example.com/1.png"
					type="text"
				/>
			)}
		</formisch.Field>
	);
}

function PassageCollectionFields(props: FieldProps) {
	return (
		<formisch.FieldArray of={props.form} path={["collection"]}>
			{(fieldArray) => (
				<fieldset
					aria-invalid={!!fieldArray.errors}
					class="fieldset relative rounded-box border border-base-300 bg-base-300 p-4 shadow-md sm:col-span-2"
				>
					<legend class="fieldset-legend">
						Passage Collections{" "}
						<InfoButtonPopover
							config={{ root: { placement: "top" } }}
							description="A passage collection consists of a piece of text alongside an optional image to be displated to the user. This is where you'll write your heart's desire :3."
							title="Passage Collections"
						/>{" "}
					</legend>

					<BaseButton
						class="btn-xs absolute right-4"
						onClick={() =>
							formisch.insert(props.form, { path: ["collection"] })
						}
					>
						Add Collection <PlusIcon />
					</BaseButton>

					<div class="mt-4 grid gap-8 sm:grid-cols-2">
						<For each={fieldArray.items}>
							{(_, idx) => (
								<div class="relative space-y-4 pt-10">
									<BaseButton
										class="btn-xs absolute top-0 left-0"
										onClick={() =>
											formisch.remove(props.form, {
												at: idx(),
												path: ["collection"],
											})
										}
									>
										Delete Collection <Trash2Icon size={16} />
									</BaseButton>

									<PassageCollectionFieldText form={props.form} idx={idx()} />

									<PassageCollectionFieldImgs form={props.form} idx={idx()} />
								</div>
							)}
						</For>
					</div>

					<div class="validator-hint hidden">{fieldArray.errors?.[0]}</div>
				</fieldset>
			)}
		</formisch.FieldArray>
	);
}

interface ValentineMessageCreateIntroFormProps
	extends _ValentineMessageCreationFormSharedProps {
	initialInput?: ValentineMessageIntroOutput;
}

export default function ValentineMessageCreateIntroForm(
	props: ValentineMessageCreateIntroFormProps,
) {
	const navigate = useNavigate();

	/** Prioritize props, but fall back to searchParams */
	const initialInput = createAsync<ValentineMessageIntroInput>(
		async () => {
			const input =
				props.initialInput ??
				(
					await v.parseAsync(
						ValentineCombinedMessageFromCompressedBase64Schema,
						props.params,
					)
				).data.intro;

			return input;
		},
		{ initialValue: createDefaultValentineMessageIntro() },
	);

	const introForm = formisch.createForm({
		initialInput: initialInput(),
		revalidate: "input",
		schema: ValentineMessageIntroSchema,
		validate: "input",
	});

	const handleSubmitForm: formisch.SubmitHandler<
		typeof ValentineMessageIntroSchema
	> = async (introFromInputs) => {
		const combinedOldPayload = (
			await v.parseAsync(
				ValentineCombinedMessageFromCompressedBase64Schema,
				props.params,
			)
		).data;

		combinedOldPayload.intro = introFromInputs;

		const payload: ValentineCombinedMessageFromCompressedBase64Input = {
			data: await compressStringToBase64(JSON.stringify(combinedOldPayload)),
		};

		props.setParams(payload);

		// Load the outro form
		navigate(`/create/outro?${new URLSearchParams(payload)}`);
	};

	return (
		<formisch.Form
			class="**:scrollbar-track-base-200 flex max-h-[85dvh] max-w-[85dvw] flex-col rounded-box border border-base-300 bg-base-200 p-4 shadow-sm"
			of={introForm}
			onSubmit={handleSubmitForm}
		>
			<div class="grid grow gap-4 overflow-auto sm:grid-cols-2">
				<ValentineMessageIntroHeader />

				<AudioField form={introForm} />

				<BgImageField form={introForm} />

				<DelayDurationField form={introForm} />

				<ShowClickHeartsField form={introForm} />

				<PassageCollectionFields form={introForm} />
			</div>

			<div class="mt-4 flex w-full items-center justify-center gap-4">
				<BaseButton
					class="btn-ghost grow"
					onClick={(e) => {
						e.preventDefault();
						formisch.reset(introForm);
					}}
					type="reset"
				>
					Reset
				</BaseButton>
				<BaseButton class="btn-primary btn-soft grow-2" type="submit">
					Proceed
				</BaseButton>
			</div>
		</formisch.Form>
	);
}
