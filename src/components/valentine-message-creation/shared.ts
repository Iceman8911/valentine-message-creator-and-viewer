import type { NavigateOptions } from "@solidjs/router";
import type {
	ValentineMessageIntroFromCompressedBase64Input,
	ValentineMessageOutroFromCompressedBase64Input,
} from "~/models/valentine-message";

type IntroOrOutroCompressedPayload =
	| ValentineMessageIntroFromCompressedBase64Input
	| ValentineMessageOutroFromCompressedBase64Input;

export interface _ValentineMessageCreationFormSharedProps {
	params: IntroOrOutroCompressedPayload;
	setParams: (
		params: IntroOrOutroCompressedPayload,
		options?: Partial<NavigateOptions>,
	) => void;
}
