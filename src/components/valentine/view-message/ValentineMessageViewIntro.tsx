import clsx from "clsx/lite";
import {
	createMemo,
	createSelector,
	createSignal,
	For,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import { PUBLIC_ASSETS } from "/src/generated/public-assets";
import type { ValentineMessageIntroOutput } from "/src/models/valentine-message";
import { getRandomArrayElement } from "/src/utils/array";
import BaseButton from "../../ui/BaseButton";
import type { _ValentineMessageViewSharedProps } from "./shared";

interface ValentineMessageViewIntroProps
	extends _ValentineMessageViewSharedProps {
	intro: ValentineMessageIntroOutput;
}

/** Plays the intro part */
export default function ValentineMessageViewIntro(
	props: ValentineMessageViewIntroProps,
) {
	const introSettings = createMemo(() => props.intro);

	const [currIdx, setCurrIdx] = createSignal(0);
	const isCurrIdx = createSelector(currIdx);

	const isAtEnd = () => isCurrIdx(introSettings().collection.length - 1);
	const isAtStart = () => isCurrIdx(0);

	const handlePrevBtnClick = () => setCurrIdx(currIdx() - 1);
	const handleNextBtnClick = () => {
		if (!isAtEnd()) {
			setCurrIdx(currIdx() + 1);
		} else {
			// proceed to the final outro part
			props.setMode("outro");
		}
	};

	onMount(() => {
		const { delayMs } = introSettings();

		if (delayMs > 0) {
			const autoAdvanceIdxIntervalId = setInterval(() => {
				if (currIdx() >= introSettings().collection.length - 1 || currIdx() < 0)
					clearInterval(autoAdvanceIdxIntervalId);

				handleNextBtnClick();
			}, delayMs);

			onCleanup(() => clearInterval(autoAdvanceIdxIntervalId));
		}
	});

	return (
		<div class="grid max-w-[80vw] grid-cols-5 grid-rows-[2fr_1fr_1fr] gap-4 *:place-self-center">
			<For each={introSettings().collection}>
				{(passage, passageIdx) => (
					<Show when={isCurrIdx(passageIdx())}>
						<img
							alt="Valentine Gif"
							class="motion-preset-fade col-span-3 col-start-2 row-start-1 max-h-72 w-auto rounded-box"
							src={
								passage.img ??
								getRandomArrayElement(PUBLIC_ASSETS["/gif-happy"])
							}
						/>

						<h2 class="wrap-anywhere motion-preset-fade col-span-5 row-start-2 max-h-30 overflow-auto font-semibold text-2xl">
							{passage.text}
						</h2>
					</Show>
				)}
			</For>

			{/* TODO: reduce jumpiness by enforicing a static size on the grid */}
			<BaseButton
				class="btn-lg col-span-2 col-start-1 row-start-3 sm:col-span-1 sm:col-start-2"
				disabled={isAtStart()}
				onClick={handlePrevBtnClick}
			>
				Prev
			</BaseButton>

			<BaseButton
				class={clsx(
					"btn-lg col-span-2 col-start-4 row-start-3 sm:col-span-1 sm:col-start-4",
					isAtEnd() &&
						"btn-primary animate-pulse drop-shadow drop-shadow-primary",
				)}
				onClick={handleNextBtnClick}
			>
				{isAtEnd() ? "Ahem..." : "Next"}
			</BaseButton>
		</div>
	);
}
