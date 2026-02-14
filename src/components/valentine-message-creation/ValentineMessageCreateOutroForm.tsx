import * as formisch from "@formisch/solid";
import { createAsync } from "@solidjs/router";
import { PlusIcon, Trash2Icon } from "lucide-solid";
import { For } from "solid-js";
import * as v from "valibot";
import {
	createDefaultCombinedValentineMessage,
	createDefaultValentineMessageOutro,
	ValentineCombinedMessageFromCompressedBase64Schema,
	type ValentineCombinedMessageToCompressedBase64Input,
	type ValentineCombinedMessageToCompressedBase64Output,
	ValentineCombinedMessageToCompressedBase64Schema,
	type ValentineMessageOutroInput,
	type ValentineMessageOutroOutput,
	ValentineMessageOutroSchema,
} from "~/models/valentine-message";
import BaseButton from "../ui/BaseButton";
import FieldsetRadioGroupInput from "../ui/form-fields/FieldsetRadioGroupInput";
import FieldsetTextInput from "../ui/form-fields/FieldsetTextInput";
import FieldsetToggleInput from "../ui/form-fields/FieldsetToggleInput";
import FloatingLabelTextInput from "../ui/form-fields/FloatingLabelTextInput";
import InfoButtonPopover from "../ui/InfoButtonPopover";
import type { _ValentineMessageCreationFormSharedProps } from "./shared";

function ValentineMessageOutroHeader() {
	return (
		<div class="mb-4 space-y-2 sm:col-span-2">
			<h2 class="font-semibold">Valentine Message Outro</h2>

			<p class="text-sm sm:hidden">
				Everything that leads up to the final choice! <br /> Hope it goes well
				^w^
			</p>
			<p class="hidden text-sm sm:block">
				Everything that leads up to the final choice! Hope it goes well ^w^
			</p>
		</div>
	);
}

interface FieldProps {
	form: formisch.FormStore<typeof ValentineMessageOutroSchema>;
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

function DialogTitleField(props: FieldProps) {
	return (
		<formisch.Field of={props.form} path={["dialog", "title"]}>
			{(field) => (
				<FieldsetTextInput
					{...field.props}
					errors={field.errors}
					infoPopover={{
						description:
							"The heading text for the final question screen (above the Yes/No buttons).",
						title: "Dialog Title",
					}}
					input={field.input}
					legend="Dialog Title"
					placeholder="Will you be my valentine? :3"
					type="text"
				/>
			)}
		</formisch.Field>
	);
}

function DialogTextField(props: FieldProps) {
	return (
		<formisch.Field of={props.form} path={["dialog", "text"]}>
			{(field) => (
				<FieldsetTextInput
					{...field.props}
					errors={field.errors}
					infoPopover={{
						description:
							"The main dialog body text shown on the final question screen.",
						title: "Dialog Text",
					}}
					input={field.input}
					legend="Dialog Text"
					placeholder="Till the ends of the earth."
					required={true}
					type="text"
				/>
			)}
		</formisch.Field>
	);
}

function DialogImgField(props: FieldProps) {
	return (
		<formisch.Field of={props.form} path={["dialog", "img"]}>
			{(field) => (
				<FieldsetTextInput
					{...field.props}
					errors={field.errors}
					infoPopover={{
						description:
							"Optional image/gif to display alongside the dialog text for the final question screen.",
						title: "Dialog Image / Gif Link",
					}}
					input={field.input}
					legend="Dialog Image / Gif Link"
					placeholder="https://www.example.com/1.gif"
					type="text"
				/>
			)}
		</formisch.Field>
	);
}

function DialogFanfareField(props: FieldProps) {
	return (
		<fieldset class="fieldset rounded-box border border-base-300 bg-base-300 p-4 shadow-md sm:col-span-2">
			<legend class="fieldset-legend">
				Dialog Fanfare{" "}
				<InfoButtonPopover
					config={{ root: { placement: "top" } }}
					description="Choose any fanfare effects to trigger when the user clicks the Yes button."
					title="Dialog Fanfare"
				/>{" "}
			</legend>

			<div class="mt-2 grid gap-2 sm:grid-cols-2">
				<formisch.Field of={props.form} path={["dialog", "fanfare", "hearts"]}>
					{(field) => (
						<FieldsetToggleInput
							{...field.props}
							errors={field.errors}
							infoPopover={{
								description: "Burst of hearts",
								title: "Hearts",
							}}
							input={field.input}
							legend="Hearts"
						/>
					)}
				</formisch.Field>

				<formisch.Field
					of={props.form}
					path={["dialog", "fanfare", "confetti"]}
				>
					{(field) => (
						<FieldsetToggleInput
							{...field.props}
							errors={field.errors}
							infoPopover={{
								description: "Confetti popper style burst",
								title: "Confetti",
							}}
							input={field.input}
							legend="Confetti"
						/>
					)}
				</formisch.Field>
			</div>
		</fieldset>
	);
}

/** No-button behaviour fields */
function NoBtnTextBehaviourField(props: FieldProps) {
	return (
		<formisch.Field of={props.form} path={["noBtnAction", "text"]}>
			{(field) => (
				<div class="sm:col-span-2">
					<FieldsetRadioGroupInput
						{...field.props}
						errors={field.errors}
						infoPopover={{
							config: { root: { placement: "top" } },
							description:
								"Controls how the visible 'No' button text cycles as the user clicks it.",
							title: "No Button Text Behaviour",
						}}
						input={field.input}
						legend="No Button Text Behaviour"
						options={[
							{
								description: "Random forever (never stops).",
								label: "Random",
								value: "random",
							},
							{
								description: "In order, stops after one full pass.",
								label: "Scroll",
								value: "scroll",
							},
							{
								description: "Scroll once, then random forever.",
								label: "Scroll Then Random",
								value: "scrollThenRandom",
							},
						]}
						variant="stack"
					/>
				</div>
			)}
		</formisch.Field>
	);
}

function NoBtnClickActionsField(props: FieldProps) {
	return (
		<fieldset class="fieldset rounded-box border border-base-300 bg-base-300 p-4 shadow-md sm:col-span-2">
			<legend class="fieldset-legend">
				No Button Click Actions{" "}
				<InfoButtonPopover
					config={{ root: { placement: "top" } }}
					description="Choose what happens when the user clicks the No button."
					title="No Button Click Actions"
				/>{" "}
			</legend>

			<div class="mt-2 grid gap-2 md:grid-cols-3">
				<formisch.Field
					of={props.form}
					path={["noBtnAction", "click", "growYesBtn"]}
				>
					{(field) => (
						<FieldsetToggleInput
							{...field.props}
							errors={field.errors}
							infoPopover={{
								description: "Make the Yes button grow larger.",
								title: "Grow Yes Button",
							}}
							input={field.input}
							legend="Grow Yes Button"
						/>
					)}
				</formisch.Field>

				<formisch.Field
					of={props.form}
					path={["noBtnAction", "click", "moveAround"]}
				>
					{(field) => (
						<FieldsetToggleInput
							{...field.props}
							errors={field.errors}
							infoPopover={{
								description:
									"Move the No button to a random position on screen.",
								title: "Move Around",
							}}
							input={field.input}
							legend="Move Around"
						/>
					)}
				</formisch.Field>

				<formisch.Field
					of={props.form}
					path={["noBtnAction", "click", "fadeOut"]}
				>
					{(field) => (
						<FieldsetToggleInput
							{...field.props}
							errors={field.errors}
							infoPopover={{
								description:
									"Fade the No button colours out (text stays readable).",
								title: "Fade Out",
							}}
							input={field.input}
							legend="Fade Out"
						/>
					)}
				</formisch.Field>
			</div>
		</fieldset>
	);
}

/** No-button text+image collection */
interface NoBtnTextCollectionFieldProps extends FieldProps {
	idx: number;
}

function NoBtnTextCollectionFieldText(props: NoBtnTextCollectionFieldProps) {
	return (
		<formisch.Field of={props.form} path={["noBtnText", props.idx, "text"]}>
			{(field) => (
				<FloatingLabelTextInput
					{...field.props}
					errors={field.errors}
					infoPopover={{
						description:
							"What the 'no button' should display as your lover clicks it >~<",
						title: "'No Button' Caption",
					}}
					input={field.input}
					label="Caption"
					placeholder="No :("
					required={true}
					type="text"
				/>
			)}
		</formisch.Field>
	);
}

function NoBtnTextCollectionFieldImg(props: NoBtnTextCollectionFieldProps) {
	return (
		<formisch.Field of={props.form} path={["noBtnText", props.idx, "img"]}>
			{(field) => (
				<FloatingLabelTextInput
					{...field.props}
					errors={field.errors}
					input={field.input}
					label="Image / Gif Link"
					placeholder="https://www.example.com/1.gif"
					type="text"
				/>
			)}
		</formisch.Field>
	);
}

function NoBtnTextCollectionFields(props: FieldProps) {
	return (
		<formisch.FieldArray of={props.form} path={["noBtnText"]}>
			{(fieldArray) => (
				<fieldset
					aria-invalid={!!fieldArray.errors}
					class="fieldset relative rounded-box border border-base-300 bg-base-300 p-4 shadow-md sm:col-span-2"
				>
					<legend class="fieldset-legend">
						No Button Captions{" "}
						<InfoButtonPopover
							config={{ root: { placement: "top" } }}
							description="These captions (with optional images) are cycled through on the No button as the user clicks it."
							title="No Button Captions"
						/>{" "}
					</legend>

					<BaseButton
						class="btn-xs absolute right-4"
						onClick={(e) => {
							e.preventDefault();
							formisch.insert(props.form, { path: ["noBtnText"] });
						}}
						type="button"
					>
						Add Caption <PlusIcon />
					</BaseButton>

					<div class="mt-4 grid gap-8 sm:grid-cols-2">
						<For each={fieldArray.items}>
							{(_, idx) => (
								<div class="relative space-y-4 pt-10">
									<BaseButton
										class="btn-xs absolute top-0 left-0"
										onClick={(e) => {
											e.preventDefault();
											formisch.remove(props.form, {
												at: idx(),
												path: ["noBtnText"],
											});
										}}
										type="button"
									>
										Delete Caption <Trash2Icon size={16} />
									</BaseButton>

									<NoBtnTextCollectionFieldText form={props.form} idx={idx()} />

									<NoBtnTextCollectionFieldImg form={props.form} idx={idx()} />
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

interface ValentineMessageCreateOutroFormProps
	extends _ValentineMessageCreationFormSharedProps {
	initialInput?: ValentineMessageOutroOutput;
}

export default function ValentineMessageCreateOutroForm(
	props: ValentineMessageCreateOutroFormProps,
) {
	/** Prioritize props, but fall back to searchParams */
	const initialInput = createAsync<ValentineMessageOutroInput>(
		async () => {
			const input =
				props.initialInput ??
				(await v
					.parseAsync(
						ValentineCombinedMessageFromCompressedBase64Schema,
						props.params,
					)
					.then((parsed) => parsed.outro)
					.catch(() => createDefaultValentineMessageOutro()));

			return input;
		},
		{ initialValue: createDefaultValentineMessageOutro() },
	);

	const outroForm = formisch.createForm({
		initialInput: initialInput(),
		revalidate: "input",
		schema: ValentineMessageOutroSchema,
		validate: "input",
	});

	const handleSubmitForm: formisch.SubmitHandler<
		typeof ValentineMessageOutroSchema
	> = async (outroFormInputs) => {
		const combinedOldPayload: ValentineCombinedMessageToCompressedBase64Input =
			await v
				.parseAsync(
					ValentineCombinedMessageFromCompressedBase64Schema,
					props.params,
				)
				.catch(() => createDefaultCombinedValentineMessage());

		combinedOldPayload.outro = outroFormInputs;

		const payload: ValentineCombinedMessageToCompressedBase64Output =
			await v.parseAsync(
				ValentineCombinedMessageToCompressedBase64Schema,
				combinedOldPayload,
			);

		props.setParams(payload);
	};

	return (
		<formisch.Form
			class="**:scrollbar-track-base-200 flex max-h-[85dvh] max-w-[85dvw] flex-col rounded-box border border-base-300 bg-base-200 p-4 shadow-sm"
			of={outroForm}
			onSubmit={handleSubmitForm}
		>
			<div class="grid grow auto-rows-min gap-4 overflow-auto sm:grid-cols-2">
				<ValentineMessageOutroHeader />

				<AudioField form={outroForm} />

				<BgImageField form={outroForm} />

				<ShowClickHeartsField form={outroForm} />

				<div class="sm:col-span-2">
					<h3 class="mb-2 font-semibold">Dialog</h3>
					<p class="text-sm opacity-80">
						This is what the user sees on the final screen.
					</p>
				</div>

				<DialogTitleField form={outroForm} />

				<DialogTextField form={outroForm} />

				<DialogImgField form={outroForm} />

				<DialogFanfareField form={outroForm} />

				<div class="sm:col-span-2">
					<h3 class="mb-2 font-semibold">No Button Behaviour</h3>
					<p class="text-sm opacity-80 sm:hidden">
						Configure how the No button acts, <br /> and what it says as they
						keep clicking it.
					</p>
					<p class="hidden text-sm opacity-80 sm:block">
						Configure how the No button acts, and what it says as they keep
						clicking it.
					</p>
				</div>

				<NoBtnTextBehaviourField form={outroForm} />

				<NoBtnClickActionsField form={outroForm} />

				<NoBtnTextCollectionFields form={outroForm} />
			</div>

			<div class="mt-4 flex w-full items-center justify-center gap-4">
				<BaseButton
					class="btn-ghost grow"
					onClick={(e) => {
						e.preventDefault();
						formisch.reset(outroForm);
					}}
					type="reset"
				>
					Reset
				</BaseButton>
				<BaseButton class="btn-primary btn-soft grow-2" type="submit">
					Done!
				</BaseButton>
			</div>
		</formisch.Form>
	);
}
