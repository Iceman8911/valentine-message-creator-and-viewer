import { createForm, Field, Form, type SubmitHandler } from "@formisch/solid";
import { createAsync } from "@solidjs/router";
import * as v from "valibot";
import {
	createDefaultValentineMessageOutro,
	type ValentineMessageOutroFromCompressedBase64Input,
	ValentineMessageOutroFromCompressedBase64Schema,
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
							ValentineMessageOutroFromCompressedBase64Schema,
							props.params,
						)
					).data;

				return input;
			} catch {
				// use defaults
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
	> = async (formValues) => {
		const payload: ValentineMessageOutroFromCompressedBase64Input = {
			data: await compressStringToBase64(JSON.stringify(formValues)),
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
