import { Link } from "@kobalte/core/link";
import type { JSXElement } from "solid-js";
import type { UrlStringOutput } from "/src/models/shared";
import BaseButton from "../ui/BaseButton";
import BaseDialog from "../ui/BaseDialog";
import ValentineHeartIcon from "./ValentineHeartIcon";

function ValentineMessageShareDialogDescription(props: {
	link: UrlStringOutput;
}) {
	return (
		<div class="flex flex-col gap-4">
			<p>
				Your valentine message is ready! Here's the link to share to your
				precious one. Enjoy! :3
			</p>

			<div class="rounded-box bg-base-100 p-4 shadow">
				<Link
					class="link link-primary inline-block w-full truncate"
					href={props.link}
					target="_blank"
				>
					{props.link}
				</Link>
			</div>

			<BaseButton
				class="ml-auto"
				onClick={() => navigator.clipboard.writeText(props.link)}
			>
				Copy Link
			</BaseButton>
		</div>
	);
}

interface ValentineMessageShareDialogProps {
	link: UrlStringOutput;
	trigger: JSXElement;
}

export default function ValentineMessageShareDialog(
	props: ValentineMessageShareDialogProps,
) {
	return (
		<BaseDialog
			description={<ValentineMessageShareDialogDescription link={props.link} />}
			title={
				<p class="flex flex-nowrap gap-2">
					<ValentineHeartIcon /> Message Share Link <ValentineHeartIcon />
				</p>
			}
			trigger={props.trigger}
		></BaseDialog>
	);
}
