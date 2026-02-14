import type { FieldElementProps } from "@formisch/solid";
import { type JSXElement, splitProps } from "solid-js";
import InfoButtonPopover, {
	type InfoButtonPopoverProps,
} from "../InfoButtonPopover";
import RequiredAsterisk from "../RequiredAsterisk";
import * as Shared from "./shared";

interface FieldsetTextInputProps extends FieldElementProps {
	infoPopover: InfoButtonPopoverProps;
	type: "text" | "email" | "tel" | "password" | "url" | "date";
	legend: JSXElement;
	placeholder?: string;
	input?: string | undefined;
	errors: [string, ...string[]] | null;
	required?: boolean;
}

export default function FieldsetTextInput(props: FieldsetTextInputProps) {
	const [, inputProps] = splitProps(props, [
		"input",
		"legend",
		"errors",
		"infoPopover",
	]);

	return (
		<fieldset class="fieldset">
			<legend class="fieldset-legend">
				{props.legend} {props.required && <RequiredAsterisk />}{" "}
				{props.infoPopover && <InfoButtonPopover {...props.infoPopover} />}
			</legend>
			<input
				{...inputProps}
				aria-errormessage={`${props.name}-error`}
				aria-invalid={!!props.errors}
				class="input validator"
				id={props.name}
				placeholder={props.placeholder}
				required={props.required}
				type="text"
				value={props.input || ""}
			/>

			<Shared._FormFieldValidatorText errors={props.errors} name={props.name} />
		</fieldset>
	);
}
