import { Popover } from "@kobalte/core";
import type {
	PopoverArrowProps,
	PopoverContentProps,
	PopoverRootProps,
	PopoverTriggerProps,
} from "@kobalte/core/popover";
import { XIcon } from "lucide-solid";
import type { JSXElement } from "solid-js";

interface BasePopoverProps {
	class?: Partial<
		Record<"trigger" | "content" | "title" | "closeBtn" | "description", string>
	>;
	trigger: JSXElement;
	title: JSXElement;
	description: JSXElement;
	config?: Partial<{
		root: PopoverRootProps;
		trigger: PopoverTriggerProps;
		arrow: PopoverArrowProps;
		content: PopoverContentProps;
	}>;
}

export default function BasePopover(props: BasePopoverProps) {
	return (
		<Popover.Root {...props.config?.root}>
			<Popover.Trigger
				class={props.class?.trigger || ""}
				{...props.config?.trigger}
			>
				{props.trigger}
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content
					class={props.class?.content || ""}
					{...props.config?.content}
				>
					<Popover.Arrow {...props.config?.arrow} />
					<div class="mb-1.5 flex items-baseline justify-between">
						<Popover.Title class={props.class?.title || ""}>
							{props.title}
						</Popover.Title>
						<Popover.CloseButton class={props.class?.closeBtn || ""}>
							<XIcon />
						</Popover.CloseButton>
					</div>
					<Popover.Description class={props.class?.description || ""}>
						{props.description}
					</Popover.Description>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}
