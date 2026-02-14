import { InfoIcon } from "lucide-solid";
import BasePopover, { type BasePopoverProps } from "./BasePopover";

export type InfoButtonPopoverProps = Omit<BasePopoverProps, "trigger">;

export default function InfoButtonPopover(props: InfoButtonPopoverProps) {
	return (
		<BasePopover
			{...props}
			class={{
				...props.class,
				trigger: `btn btn-circle btn-soft btn-xs ${props.class?.trigger || ""}`,
			}}
			trigger={<InfoIcon class="size-4" />}
		/>
	);
}
