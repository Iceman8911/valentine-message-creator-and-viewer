import { createForm, Field, Form, type SubmitHandler } from "@formisch/solid";
import { createAsync } from "@solidjs/router";
import * as v from "valibot";
import {
	createDefaultValentineMessageOutro,
	type ValentineCombinedMessageFromCompressedBase64Input,
	ValentineCombinedMessageFromCompressedBase64Schema,
	type ValentineMessageOutroOutput,
	ValentineMessageOutroSchema,
} from "~/models/valentine-message";
import { compressStringToBase64 } from "~/utils/string-compression";
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
			try {
				const input =
					props.initialInput ??
					(
						await v.parseAsync(
							ValentineCombinedMessageFromCompressedBase64Schema,
							props.params,
						)
					).data.outro;

				return input;
			} catch {
				return createDefaultValentineMessageOutro();
			}
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
		const combinedOldPayload = (
			await v.parseAsync(
				ValentineCombinedMessageFromCompressedBase64Schema,
				props.params,
			)
		).data;

		combinedOldPayload.outro = outroFormInputs;

		const payload: ValentineCombinedMessageFromCompressedBase64Input = {
			data: await compressStringToBase64(JSON.stringify(combinedOldPayload)),
		};

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
