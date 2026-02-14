import type { FieldElementProps } from "@formisch/solid";
import { type JSXElement, splitProps } from "solid-js";
import InfoButtonPopover, {
	type InfoButtonPopoverProps,
} from "../InfoButtonPopover";
import RequiredAsterisk from "../RequiredAsterisk";
import * as Shared from "./shared";

interface FieldsetToggleInputProps extends FieldElementProps {
	infoPopover: InfoButtonPopoverProps;
	legend: JSXElement;
	input?: boolean | undefined;
	errors: [string, ...string[]] | null;
	required?: boolean;
}

export default function FieldsetToggleInput(props: FieldsetToggleInputProps) {
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
				checked={!!props.input}
				class="toggle"
				id={props.name}
				required={props.required}
				type="checkbox"
			/>

			<Shared._FormFieldValidatorText errors={props.errors} name={props.name} />
		</fieldset>
	);
}
