import type { FieldElementProps } from "@formisch/solid";
import { For, type JSXElement, splitProps } from "solid-js";
import InfoButtonPopover, {
	type InfoButtonPopoverProps,
} from "../InfoButtonPopover";
import RequiredAsterisk from "../RequiredAsterisk";
import * as Shared from "./shared";

export interface RadioGroupOption<TValue extends string> {
	label: JSXElement;
	value: TValue;
	description?: JSXElement;
	disabled?: boolean;
}

interface FieldsetRadioGroupInputProps<TValue extends string>
	extends Omit<FieldElementProps, "type" | "value" | "checked" | "onChange"> {
	legend: JSXElement;
	infoPopover?: InfoButtonPopoverProps;
	errors: [string, ...string[]] | null;
	required?: boolean;

	/** The currently selected value for this radio group. */
	input?: TValue | undefined;

	/** Options to render. */
	options: readonly RadioGroupOption<TValue>[];

	/**
	 * Optional UI layout hint.
	 * - `grid` uses a responsive grid of button-like radios
	 * - `stack` uses a vertical stack (good for narrow screens)
	 */
	variant?: "grid" | "stack";

	/** Optional aria-describedby id to point to helper text outside this component */
	describedById?: string;
}

/**
 * Renders a fieldset of radio inputs in a consistent style with the other form fields.
 *
 * @remarks
 * This component is intentionally "dumb": it renders native input elements and forwards
 * the underlying `FieldElementProps` handlers so state stays in sync with Formisch.
 */
export default function FieldsetRadioGroupInput<TValue extends string>(
	props: FieldsetRadioGroupInputProps<TValue>,
) {
	const [, radioProps] = splitProps(props, [
		"legend",
		"infoPopover",
		"errors",
		"required",
		"input",
		"options",
		"variant",
		"describedById",
	]);

	const layoutClass =
		props.variant === "stack"
			? "mt-2 grid w-full gap-2"
			: "mt-2 grid w-full gap-2 sm:grid-cols-3";

	return (
		<fieldset
			aria-invalid={!!props.errors}
			class="fieldset rounded-box border border-base-300 bg-base-300 p-4 shadow-md"
		>
			<legend class="fieldset-legend">
				{props.legend} {props.required && <RequiredAsterisk />}{" "}
				{props.infoPopover && <InfoButtonPopover {...props.infoPopover} />}
			</legend>

			<div class={layoutClass}>
				<For each={props.options}>
					{(option) => {
						const id = `${props.name}-${option.value}`;

						return (
							<label
								class="flex w-full cursor-pointer items-center gap-3 rounded-box border border-base-200 bg-base-200 p-2"
								for={id}
							>
								<input
									{...radioProps}
									aria-describedby={props.describedById}
									aria-errormessage={`${props.name}-error`}
									aria-invalid={!!props.errors}
									checked={props.input === option.value}
									class="radio"
									disabled={option.disabled}
									id={id}
									name={props.name}
									required={props.required}
									type="radio"
									value={option.value}
								/>

								<div class="min-w-0 flex-1">
									<div class="font-medium">{option.label}</div>
									{option.description && (
										<div class="text-xs opacity-70">{option.description}</div>
									)}
								</div>
							</label>
						);
					}}
				</For>
			</div>

			<Shared._FormFieldValidatorText errors={props.errors} name={props.name} />
		</fieldset>
	);
}
