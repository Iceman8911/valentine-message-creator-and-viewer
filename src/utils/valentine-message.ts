import * as v from "valibot";
import { type UrlStringOutput, UrlStringSchema } from "../models/shared";
import {
	type ValentineCombinedMessageOutput,
	ValentineCombinedMessageToCompressedBase64Schema,
	type ValentineMessageSearchParamsInput,
} from "../models/valentine-message";

export async function getValentineMessageViewLink(
	message: ValentineCombinedMessageOutput,
	baseUrl: string,
): Promise<UrlStringOutput> {
	const payload: ValentineMessageSearchParamsInput = {
		data: await v.parseAsync(
			ValentineCombinedMessageToCompressedBase64Schema,
			message,
		),
	};

	return v.parse(
		UrlStringSchema,
		`${baseUrl}/view?${decodeURIComponent(`${new URLSearchParams(payload)}`)}`,
	);
}
