import { InfoIcon } from "lucide-solid";
import BasePopover from "./BasePopover";

type InfoButtonPopoverProps = Omit<
	Parameters<typeof BasePopover>[0],
	"trigger"
>;

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
