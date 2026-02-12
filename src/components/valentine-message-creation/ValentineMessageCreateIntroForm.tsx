import * as formisch from "@formisch/solid";
import { createAsync } from "@solidjs/router";
import { PlusIcon } from "lucide-solid";
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
import type { _ValentineMessageCreationFormSharedProps } from "./shared";

function ValentineMessageIntroHeader() {
	return (
		<div class="col-span-2 mb-4 space-y-2">
			<h2 class="font-semibold">Valentine Message Intro</h2>

			<p class="text-sm">Type out what you wanna say to your bae / boo :3</p>
		</div>
	);
}

interface FieldProps {
	of: formisch.FormStore<typeof ValentineMessageIntroSchema>;
}

function AudioField(props: FieldProps) {
	return (
		<formisch.Field of={props.of} path={["audio"]}>
			{(field) => (
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Audio Link</legend>
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
		<formisch.Field of={props.of} path={["bgImage"]}>
			{(field) => (
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Background Image Link</legend>
					<input
						{...field.props}
						aria-invalid={!!field.errors}
						class="input validator"
						id={field.props.name}
						placeholder="https://www.example.com/bg.png"
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

function DelayDurationField(props: FieldProps) {
	const [min, max] = (() => {
		const [, , , toMinValSchema, toMaxValSchema] =
			ValentineMessageIntroSchema.entries.delayMs.wrapped.pipe;

		return [toMinValSchema.requirement, toMaxValSchema.requirement];
	})();

	return (
		<formisch.Field of={props.of} path={["delayMs"]}>
			{(field) => (
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Delay (in milliseconds)</legend>
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
					<div class="validator-hint hidden">
						{field.errors && <div>{field.errors[0]}</div>}
					</div>
				</fieldset>
			)}
		</formisch.Field>
	);
}

function CollectionFields(props: FieldProps) {
	return (
		<formisch.FieldArray of={props.of} path={["collection"]}>
			{(fieldArray) => (
				<fieldset class="fieldset relative w-xs rounded-box border border-base-300 p-4">
					<legend class="fieldset-legend">Passage Collections</legend>

					<BaseButton
						class="btn-xs absolute right-4"
						onClick={() => formisch.insert(props.of, { path: ["collection"] })}
					>
						Add Passage <PlusIcon />
					</BaseButton>

					<For each={fieldArray.items}>
						{(_, idx) => (
							<formisch.Field
								of={props.of}
								path={["collection", idx(), "text"]}
							>
								{(field) => (
									<>
										<label class="label" for={field.props.name}>
											Collection {` ${idx() + 1}`}
										</label>
										<input
											{...field.props}
											class="input validator"
											id={field.props.name}
											type="text"
											value={field.input ?? ""}
										></input>
										<div class="validator-hint">
											{field.errors && <div>{field.errors[0]}</div>}
										</div>
									</>
								)}
							</formisch.Field>
						)}
					</For>

					<div class="validator-hint">
						{fieldArray.errors && <div>{fieldArray.errors[0]}</div>}
					</div>
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
		schema: ValentineMessageIntroSchema,
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
			class="flex max-h-[85dvh] max-w-[85dvw] flex-col rounded-box border border-base-300 p-4 shadow-sm"
			of={introForm}
			onSubmit={handleSubmitForm}
		>
			<div class="grid grow grid-cols-2 gap-4 overflow-auto">
				<ValentineMessageIntroHeader />

				<AudioField of={introForm} />

				<BgImageField of={introForm} />

				<DelayDurationField of={introForm} />

				{/*<CollectionFields of={introForm} />*/}
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
