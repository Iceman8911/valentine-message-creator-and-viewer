import clsx from "clsx/lite";
import { HeartIcon } from "lucide-solid";

export default function ValentineHeartIcon(props: { class?: string }) {
	return (
		<HeartIcon
			class={clsx("fill-primary motion-safe:animate-pulse", props.class)}
		/>
	);
}
