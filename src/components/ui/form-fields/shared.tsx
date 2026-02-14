export function _FormFieldValidatorText(props: {
	name: string;
	errors: string[] | null;
}) {
	return (
		<div
			class="validator-hint hidden overflow-auto contain-inline-size"
			id={`${props.name}-error`}
		>
			{props.errors?.[0]}
		</div>
	);
}
