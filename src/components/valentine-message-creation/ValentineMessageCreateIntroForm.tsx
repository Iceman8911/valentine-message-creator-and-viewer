import * as formisch from "@formisch/solid";
import { createAsync } from "@solidjs/router";
import { PlusIcon, Trash2Icon } from "lucide-solid";
import { For } from "solid-js";
import * as v from "valibot";
import {
	createDefaultValentineMessageIntro,
	type ValentineMessageIntroFromCompressedBase64Input,
	ValentineMessageIntroFromCompressedBase64Schema,
	type ValentineMessageIntroInput,
	type ValentineMessageIntroOutput,
	ValentineMessageIntroSchema,
} from "~/models/valentine-message";
import { compressStringToBase64 } from "~/utils/string-compression";
import BaseButton from "../ui/BaseButton";
import InfoButtonPopover from "../ui/InfoButtonPopover";
import RequiredAsterisk from "../ui/RequiredAsterisk";
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
				<fieldset class="fieldset">
					<legend class="fieldset-legend">
						Audio Link{" "}
						<InfoButtonPopover
							description="A link to an online audio asset that should play in the background while the user views the message."
							title="Audio Link"
						/>{" "}
					</legend>
					<input
						{...field.props}
						aria-invalid={!!field.errors}
						class="input validator"
						id={field.props.name}
						placeholder="https://www.example.com/bg.mp3"
						type="text"
						value={field.input || ""}
					/>
					<div class="validator-hint hidden">
						{field.errors && <div>{field.errors[0]}</div>}
					</div>
				</fieldset>
			)}
		</formisch.Field>
	);
}

function BgImageField(props: FieldProps) {
	return (
		<formisch.Field of={props.form} path={["bgImage"]}>
			{(field) => (
				<fieldset class="fieldset">
					<legend class="fieldset-legend">
						Background Image Link{" "}
						<InfoButtonPopover
							description="A link to an online image asset to replace the default background."
							title="Background Image Link"
						/>{" "}
					</legend>
					<input
						{...field.props}
						aria-invalid={!!field.errors}
						class="input validator"
						id={field.props.name}
						placeholder="https://www.example.com/bg.png"
						type="text"
						value={field.input || ""}
					/>
					<div class="validator-hint hidden">{field.errors?.[0]}</div>
				</fieldset>
			)}
		</formisch.Field>
	);
}

function ShowClickHeartsField(props: FieldProps) {
	return (
		<formisch.Field of={props.form} path={["showClickHearts"]}>
			{(field) => (
				<fieldset class="fieldset">
					<legend class="fieldset-legend">
						Show Heart Animation on Click{" "}
						<InfoButtonPopover
							description="Play a cute heart animation wherever the screen is clicked."
							title="Show Heart Animation on Click"
						/>{" "}
					</legend>
					<input
						{...field.props}
						aria-invalid={!!field.errors}
						checked={field.input}
						class="toggle"
						id={field.props.name}
						type="checkbox"
					/>
					<div class="validator-hint hidden">{field.errors?.[0]}</div>
				</fieldset>
			)}
		</formisch.Field>
	);
}

function DelayDurationField(props: FieldProps) {
	const [min, max] = (() => {
		const [, , , toMinValSchema, toMaxValSchema] =
			ValentineMessageIntroSchema.entries.delayMs.wrapped.pipe;

		return [toMinValSchema.requirement, toMaxValSchema.requirement];
	})();

	return (
		<formisch.Field of={props.form} path={["delayMs"]}>
			{(field) => (
				<fieldset class="fieldset">
					<legend class="fieldset-legend">
						Delay (in milliseconds){" "}
						<InfoButtonPopover
							description="How long, in milliseconds, a passage is played before automatically advancing to the next. A value of '0' disables this behaviour."
							title="Delay"
						/>{" "}
					</legend>
					<input
						{...field.props}
						aria-invalid={!!field.errors}
						class="input validator"
						id={field.props.name}
						max={max}
						min={min}
						type="number"
						value={field.input}
					/>
					<div class="validator-hint hidden">{field.errors?.[0]}</div>
				</fieldset>
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
				<div>
					<label class="floating-label" for={field.props.name}>
						<span>
							Passage <RequiredAsterisk />
						</span>

						<input
							{...field.props}
							aria-invalid={!!field.errors}
							class="input validator"
							id={field.props.name}
							placeholder="I love you :3"
							required
							type="text"
							value={field.input ?? ""}
						></input>
					</label>
					<div class="validator-hint hidden">{field.errors?.[0]}</div>
				</div>
			)}
		</formisch.Field>
	);
}

function PassageCollectionFieldImgs(props: PassageCollectionFieldProps) {
	return (
		<formisch.Field of={props.form} path={["collection", props.idx, "img"]}>
			{(field) => (
				<div>
					<label class="floating-label" for={field.props.name}>
						<span>Image / Gif Link</span>

						<input
							{...field.props}
							aria-invalid={!!field.errors}
							class="input validator"
							id={field.props.name}
							placeholder="https://www.example.com/1.png"
							required
							type="text"
							value={field.input ?? ""}
						></input>
					</label>
					<div class="validator-hint hidden">{field.errors?.[0]}</div>
				</div>
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
							description="A passage collection consists of a piece of text alongside an optional image to be displated to the user. This is where you'll write your hearts desire :3."
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
	/** Prioritize props, but fall back to searchParams */
	const initialInput = createAsync<ValentineMessageIntroInput>(
		async () => {
			try {
				const input =
					props.initialInput ??
					(
						await v.parseAsync(
							ValentineMessageIntroFromCompressedBase64Schema,
							props.params,
						)
					).data;

				return input;
			} catch {
				// Fallback to defaults
				return createDefaultValentineMessageIntro();
			}
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
	> = async (formValues) => {
		const payload: ValentineMessageIntroFromCompressedBase64Input = {
			data: await compressStringToBase64(JSON.stringify(formValues)),
		};

		props.setParams(payload);
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
