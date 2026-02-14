import type { Setter } from "solid-js";
import type { ValentineMessageMode } from "../../types/valentine-message";

export interface _ValentineMessageViewSharedProps {
	/** Setting what message view to display. Should be called `intro` -> `outro` when the former is done playing */
	setMode: Setter<ValentineMessageMode>;
}
