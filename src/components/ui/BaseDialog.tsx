import { Dialog } from "@kobalte/core";
import type {
	DialogContentProps,
	DialogRootProps,
	DialogTriggerProps,
} from "@kobalte/core/dialog";
import clsx from "clsx/lite";
import { XIcon } from "lucide-solid";
import type { JSXElement } from "solid-js";

interface BaseDialogProps {
	config?: Partial<{
		root: DialogRootProps;
		trigger: DialogTriggerProps;
		content: DialogContentProps;
	}>;
	title: JSXElement;
	description: JSXElement;
	trigger: JSXElement;
	class?: Partial<Record<"trigger" | "overlay", string>>;
}

export default function BaseDialog(props: BaseDialogProps) {
	return (
		<Dialog.Root {...props.config?.root}>
			<Dialog.Trigger
				class={clsx("contents", props.class?.trigger)}
				{...props.config}
			>
				{props.trigger}
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay
					class={clsx(
						"ui-expanded:motion-opacity-in-0 ui-not-expanded:motion-opacity-out-0 fixed inset-0 z-50 brightness-75 backdrop-blur",
						props.class?.overlay,
					)}
				></Dialog.Overlay>

				<div class="fixed inset-0 z-50 flex items-center justify-center">
					<Dialog.Content
						class={clsx(
							"ui-expanded:motion-opacity-in-0 ui-not-expanded:motion-opacity-out-0 max-w-[80vw] origin-(--kb-popover-content-transform-origin) rounded-box border border-base-300 bg-base-200 p-4 shadow sm:max-w-xl",
						)}
						{...props.config?.content}
					>
						<div class="mb-4 flex items-baseline justify-between">
							<Dialog.Title class="font-semibold">{props.title}</Dialog.Title>
							<Dialog.CloseButton class="btn btn-circle btn-xs">
								<XIcon />
							</Dialog.CloseButton>
						</div>
						<Dialog.Description class="text-sm">
							{props.description}
						</Dialog.Description>
					</Dialog.Content>
				</div>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
