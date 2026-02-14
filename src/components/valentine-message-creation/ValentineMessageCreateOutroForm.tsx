import { createForm, Field, Form, type SubmitHandler } from "@formisch/solid";
import { createAsync } from "@solidjs/router";
import * as v from "valibot";
import {
	createDefaultCombinedValentineMessage,
	createDefaultValentineMessageOutro,
	ValentineCombinedMessageFromCompressedBase64Schema,
	type ValentineCombinedMessageToCompressedBase64Input,
	type ValentineCombinedMessageToCompressedBase64Output,
	ValentineCombinedMessageToCompressedBase64Schema,
	type ValentineMessageOutroOutput,
	ValentineMessageOutroSchema,
} from "~/models/valentine-message";
import type { _ValentineMessageCreationFormSharedProps } from "./shared";

interface ValentineMessageCreateOutroFormProps
	extends _ValentineMessageCreationFormSharedProps {
	initialInput?: ValentineMessageOutroOutput;
}

export default function ValentineMessageCreateOutroForm(
	props: ValentineMessageCreateOutroFormProps,
) {
	/** Prioritize props, but fall back to searchParams */
	const initialInput = createAsync<ValentineMessageOutroOutput>(
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

	const introForm = createForm({
		initialInput: initialInput(),
		schema: ValentineMessageOutroSchema,
	});

	const handleSubmitForm: SubmitHandler<
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
		<Form of={introForm} onSubmit={handleSubmitForm}>
			<Field of={introForm} path={["audio"]}>
				{(field) => <input {...field.props} value={field.input}></input>}
			</Field>
		</Form>
	);
}
