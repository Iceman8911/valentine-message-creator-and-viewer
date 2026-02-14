import { createMemo } from "solid-js";
import type { ValentineMessageIntroOutput } from "/src/models/valentine-message";
import type { _ValentineMessageViewSharedProps } from "./shared";

// import clsx from "clsx/lite"

interface ValentineMessageViewIntroProps
	extends _ValentineMessageViewSharedProps {
	intro: ValentineMessageIntroOutput;
}

/** Plays the intro part */
export default function ValentineMessageViewIntro(
	props: ValentineMessageViewIntroProps,
) {
	const introSettings = createMemo(() => props.intro);
	introSettings();

	return <div></div>;
}
