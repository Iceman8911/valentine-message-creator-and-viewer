import { createAsync, useSearchParams } from "@solidjs/router";
import { confetti } from "@tsparticles/confetti";
import { ErrorBoundary, onCleanup, onMount, Show } from "solid-js";
import * as v from "valibot";
import {
	ValentineCombinedMessageFromCompressedBase64Schema,
	ValentineCombinedMessageSchema,
	ValentineMessageSearchParamsSchema,
} from "/src/models/valentine-message";
import { getRandomIntegerInRangeInclusively } from "/src/utils/number";
export default function ValentineMessageViewPage() {
	let outermostElement!: HTMLDivElement;

	const valentineMessage = createAsync(async () => {
		try {
			const params = v.parse(
				ValentineMessageSearchParamsSchema,
				useSearchParams()[0],
			);

			return await v.parseAsync(
				ValentineCombinedMessageFromCompressedBase64Schema,
				params.data,
			);
		} catch {
			return null;
		}
	});

	onMount(() => {
		const handleClick = async (event: MouseEvent) => {
			const { clientX, clientY } = event;
			const origin = {
				x: clientX / window.innerWidth,
				y: clientY / window.innerHeight,
			};

			await confetti({
				angle: getRandomIntegerInRangeInclusively(0, 360), // Burst direction (upward)
				colors: ["#FF69B4", "#FFC0CB", "#FF1493"], // Valentine pinks/reds
				decay: 0.9, // Slowdown rate
				drift: getRandomIntegerInRangeInclusively(0, 30),
				gravity: 1, // Fall effect
				origin,
				particleCount: getRandomIntegerInRangeInclusively(25, 75), // Number of hearts
				scalar: getRandomIntegerInRangeInclusively(2, 8) * 0.5, // Size multiplier
				shapes: ["heart"], // Heart shape
				spread: getRandomIntegerInRangeInclusively(30, 60), // Spread angle
				startVelocity: getRandomIntegerInRangeInclusively(20, 40), // Speed
				ticks: 200, // Lifespan
			});
		};

		outermostElement.addEventListener("click", handleClick);

		onCleanup(() => {
			outermostElement.removeEventListener("click", handleClick);
		});
	});

	return (
		<main
			class="flex size-full items-center justify-center"
			ref={outermostElement}
		>
			<ErrorBoundary
				fallback={(e) => (
					<>
						Something went wrong 💀, likely the url of this page is invalid{" "}
						{">~<"}.<br /> Note that the actual error is {`${e}`}
					</>
				)}
			>
				<Show
					fallback="Something went wrong 💀, likely the url of this page is invalid >~<"
					when={
						v.is(ValentineCombinedMessageSchema, valentineMessage.latest) &&
						valentineMessage.latest
					}
				>
					{(message) => <div>Bob</div>}
				</Show>
			</ErrorBoundary>
		</main>
	);
}
