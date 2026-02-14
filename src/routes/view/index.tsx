import { createAsync, useSearchParams } from "@solidjs/router";
import { confetti } from "@tsparticles/confetti";
import { PauseIcon, PlayIcon } from "lucide-solid";
import {
	createMemo,
	createSignal,
	ErrorBoundary,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import * as v from "valibot";
import type { ValentineMessageMode } from "/src/components/types/valentine-message";
import BaseButton from "/src/components/ui/BaseButton";
import ValentineMessageViewIntro from "/src/components/valentine/view-message/ValentineMessageViewIntro";
import ValentineMessageViewOutro from "/src/components/valentine/view-message/ValentineMessageViewOutro";
import { PUBLIC_ASSETS } from "/src/generated/public-assets";
import type { UrlStringOutput } from "/src/models/shared";
import {
	ValentineCombinedMessageFromCompressedBase64Schema,
	ValentineCombinedMessageSchema,
	ValentineMessageSearchParamsSchema,
} from "/src/models/valentine-message";
import { getRandomArrayElement } from "/src/utils/array";
import { getRandomIntegerInRangeInclusively } from "/src/utils/number";

function HiddenAutoplayAudioElement(props: {
	ref: HTMLAudioElement;
	link?: UrlStringOutput | undefined;
}) {
	return (
		// biome-ignore lint/a11y/useMediaCaption: background audio; not user-facing media content
		<audio
			class="hidden"
			inert
			loop
			onError={(e) => {
				e.currentTarget.src =
					getRandomArrayElement(PUBLIC_ASSETS["/audio"]) ?? "";
			}}
			ref={props.ref}
			src={props.link ?? getRandomArrayElement(PUBLIC_ASSETS["/audio"])}
			tabindex={-1}
		/>
	);
}

function HiddenAutoplayAudioElementToggleBtn(props: {
	audio$?: HTMLAudioElement;
}) {
	const [isAudioPaused, setIsAudioPaused] = createSignal(true);
	const audio$ = () => props.audio$;

	onMount(() => {
		const audio = audio$();

		if (audio) audio.volume = 0.5;
	});

	async function handleAudioToggle() {
		if (isAudioPaused()) {
			await audio$()?.play();
			setIsAudioPaused(false);
		} else {
			audio$()?.pause();
			setIsAudioPaused(true);
		}
	}

	return (
		<BaseButton
			class="btn-secondary btn-soft absolute top-4 right-4 flex gap-2"
			onClick={handleAudioToggle}
		>
			<Show
				fallback={
					<>
						<PauseIcon /> Pause BG Music
					</>
				}
				when={isAudioPaused()}
			>
				<PlayIcon />
				Play BG Music
			</Show>
		</BaseButton>
	);
}

export default function ValentineMessageViewPage() {
	const [messageMode, setMessageMode] =
		createSignal<ValentineMessageMode>("intro");

	let outermostElement!: HTMLDivElement;
	let hiddenAutoplay$!: HTMLAudioElement;

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

	const sharedIntroAndOutroProps = createMemo(() =>
		messageMode() === "intro"
			? valentineMessage()?.intro
			: valentineMessage()?.outro,
	);

	onMount(() => {
		if (!sharedIntroAndOutroProps()?.showClickHearts) return;

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
		<main class="relative size-full" ref={outermostElement}>
			{/* Blurred background layer */}
			<div
				class="absolute inset-0 bg-center bg-cover opacity-50 blur-xs"
				style={{
					"background-image": `url("${sharedIntroAndOutroProps()?.bgImage ?? getRandomArrayElement(PUBLIC_ASSETS["/image"])}")`,
				}}
			/>

			<div class="relative flex size-full items-center justify-center">
				<HiddenAutoplayAudioElement
					link={sharedIntroAndOutroProps()?.audio}
					ref={hiddenAutoplay$}
				/>

				<HiddenAutoplayAudioElementToggleBtn audio$={hiddenAutoplay$} />

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
						{(message) => (
							<Show
								fallback={
									<ValentineMessageViewOutro
										outro={message().outro}
										setMode={setMessageMode}
									/>
								}
								when={messageMode() === "intro"}
							>
								<ValentineMessageViewIntro
									intro={message().intro}
									setMode={setMessageMode}
								/>
							</Show>
						)}
					</Show>
				</ErrorBoundary>
			</div>
		</main>
	);
}
