import type { NavigateOptions } from "@solidjs/router";
import type { ValentineCombinedMessageFromCompressedBase64Input } from "~/models/valentine-message";

export interface _ValentineMessageCreationFormSharedProps {
	params: ValentineCombinedMessageFromCompressedBase64Input;
	setParams: (
		params: ValentineCombinedMessageFromCompressedBase64Input,
		options?: Partial<NavigateOptions>,
	) => void;
}
