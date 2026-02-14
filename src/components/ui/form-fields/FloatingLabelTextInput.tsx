import type { FieldElementProps } from "@formisch/solid";
import { type JSXElement, splitProps } from "solid-js";
import InfoButtonPopover, {
	type InfoButtonPopoverProps,
} from "../InfoButtonPopover";
import RequiredAsterisk from "../RequiredAsterisk";
import * as Shared from "./shared";

interface FloatingLabelTextInputProps extends FieldElementProps {
	infoPopover?: InfoButtonPopoverProps;
	type: "text" | "email" | "tel" | "password" | "url" | "date";
	label: JSXElement;
	placeholder?: string;
	input?: string | undefined;
	errors: [string, ...string[]] | null;
	required?: boolean;
}

export default function FloatingLabelTextInput(
	props: FloatingLabelTextInputProps,
) {
	const [, inputProps] = splitProps(props, [
		"input",
		"label",
		"errors",
		"infoPopover",
	]);

	return (
		<label class="floating-label" for={props.name}>
			<span>
				{props.label} {props.required && <RequiredAsterisk />}{" "}
				{props.infoPopover && <InfoButtonPopover {...props.infoPopover} />}
			</span>
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
		</label>
	);
}
