import type { ValentineMessageOutroOutput } from "/src/models/valentine-message";
import type { _ValentineMessageViewSharedProps } from "./shared";

interface ValentineMessageViewOutroProps
	extends _ValentineMessageViewSharedProps {
	outro: ValentineMessageOutroOutput;
}

/** Plays the outro part */
export default function ValentineMessageViewOutro(
	props: ValentineMessageViewOutroProps,
) {
	props.outro;

	return "";
}
