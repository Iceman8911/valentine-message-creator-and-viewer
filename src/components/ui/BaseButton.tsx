import type { ComponentProps } from "solid-js";

export default function BaseButton(props: ComponentProps<"button">) {
	return (
		<button
			{...props}
			class={`btn ${props.class || ""}`}
			type={props.type ?? "button"}
		></button>
	);
}
