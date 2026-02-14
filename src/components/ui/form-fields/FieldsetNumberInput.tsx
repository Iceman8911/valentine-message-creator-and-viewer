import type { FieldElementProps } from "@formisch/solid";
import { type JSXElement, splitProps } from "solid-js";
import InfoButtonPopover, {
	type InfoButtonPopoverProps,
} from "../InfoButtonPopover";
import RequiredAsterisk from "../RequiredAsterisk";
import * as Shared from "./shared";

interface FieldsetNumberInputProps extends FieldElementProps {
	infoPopover: InfoButtonPopoverProps;
	legend: JSXElement;
	placeholder?: number;
	input?: string | number | undefined;
	errors: [string, ...string[]] | null;
	required?: boolean;
	max?: number;
	min?: number;
}

export default function FieldsetNumberInput(props: FieldsetNumberInputProps) {
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
				max={props.max}
				min={props.min}
				placeholder={props.placeholder ? `${props.placeholder}` : undefined}
				type="number"
				value={props.input}
			/>

			<Shared._FormFieldValidatorText errors={props.errors} name={props.name} />
		</fieldset>
	);
}
