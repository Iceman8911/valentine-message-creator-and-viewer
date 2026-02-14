import clsx from "clsx/lite";
import { HeartIcon } from "lucide-solid";

export default function ValentineHeartIcon(props: { class?: string }) {
	return (
		<div class="flex gap-2 motion-safe:animate-pulse">
			<HeartIcon class={clsx("fill-primary", props.class)} />💕
		</div>
	);
}
