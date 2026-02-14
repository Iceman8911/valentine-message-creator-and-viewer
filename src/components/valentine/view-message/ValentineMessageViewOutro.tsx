import clsx from "clsx/lite";
import { HeartIcon } from "lucide-solid";
import { createMemo, createSelector, createSignal, For, Show } from "solid-js";
import { PUBLIC_ASSETS } from "/src/generated/public-assets";
import type { ValentineMessageOutroOutput } from "/src/models/valentine-message";
import { getRandomArrayElement } from "/src/utils/array";
import { getRandomIntegerInRangeInclusively } from "/src/utils/number";
import BaseButton from "../../ui/BaseButton";
import BaseDialog from "../../ui/BaseDialog";
import type { _ValentineMessageViewSharedProps } from "./shared";

const SIZES = ["size-30", "size-25", "size-20", "size-15"] as const;
const COLORS = [
	"fill-primary/50 stroke-primary/50",
	"fill-secondary/50 stroke-secondary/50",
	"fill-accent/50 stroke-accent/50",
] as const;
interface ValentineMessageViewOutroProps
	extends _ValentineMessageViewSharedProps {
	outro: ValentineMessageOutroOutput;
}

/** Plays the outro part */
export default function ValentineMessageViewOutro(
	props: ValentineMessageViewOutroProps,
) {
	const outroSettings = createMemo(() => props.outro);
	const outroSettingsNoBtnTextBehaviourLength = () =>
		outroSettings().noBtnText.length;
	const [useHappyImg, setUseHappyImg] = createSignal(true);
	const [currIdx, setCurrIdx] = createSignal(0);
	const isCurrIdx = createSelector(currIdx);
	const isAtEnd = () => isCurrIdx(outroSettingsNoBtnTextBehaviourLength() - 1);

	const hasScrolledThroughAllOptions = false;
	let timesClickedNoBtn = 0;

	let yesBtn$!: HTMLButtonElement;
	let noBtn$!: HTMLButtonElement;
	let container$!: HTMLDivElement;

	const handleYesBtnClick = () => {
		setUseHappyImg(true);
	};

	const handleNoBtnClick = () => {
		timesClickedNoBtn++;

		setUseHappyImg(false);

		const length = outroSettingsNoBtnTextBehaviourLength() - 1;
		const { noBtnAction } = outroSettings();

		function randomFn() {
			setCurrIdx(getRandomIntegerInRangeInclusively(0, length));
		}

		function scrollFn() {
			setCurrIdx(currIdx() >= length ? currIdx() : currIdx() + 1);
		}

		switch (noBtnAction.text) {
			case "random":
				randomFn();
				break;
			case "scroll":
				scrollFn();
				break;
			case "scrollThenRandom":
				if (hasScrolledThroughAllOptions) {
					randomFn();
				} else {
					scrollFn();
				}
				break;
		}

		if (noBtnAction.click) {
			const { fadeOut, growYesBtn, moveAround } = noBtnAction.click;

			if (fadeOut) {
				noBtn$.style.opacity = `${1 - Math.min(0.1 * timesClickedNoBtn, 1)}`;
			}

			if (growYesBtn) {
				yesBtn$.style.scale = `${1 + Math.min(0.2 * timesClickedNoBtn, 5)}`;
			}

			if (moveAround) {
				noBtn$.style.position = "fixed";
				noBtn$.style.top = `${getRandomIntegerInRangeInclusively(20, container$.clientHeight - 20)}px`;
				noBtn$.style.right = `${getRandomIntegerInRangeInclusively(20, container$.clientWidth - 20)}px`;
			}
		}
	};

	return (
		<div class="relative grid size-full place-items-center" ref={container$}>
			{/* Background */}
			<div class="absolute inset-0 flex size-full flex-wrap items-center justify-center gap-4 overflow-clip bg-primary/50">
				<For each={Array.from({ length: 100 }, (_, i) => i)}>
					{() => (
						<HeartIcon
							class={clsx(
								getRandomArrayElement(SIZES),
								getRandomArrayElement(COLORS),
							)}
						/>
					)}
				</For>
			</div>

			<div class="z-1 grid grid-cols-5 grid-rows-[2fr_1fr_1fr] place-items-center">
				<For each={outroSettings().noBtnText}>
					{(data, idx) => (
						<Show when={isCurrIdx(idx())}>
							<img
								alt="Valentine Gif"
								class="motion-preset-fade col-span-3 col-start-2 row-start-1 max-h-72 w-auto rounded-box"
								src={
									data.img ??
									getRandomArrayElement(
										PUBLIC_ASSETS[useHappyImg() ? "/gif-happy" : "/gif-sad"],
									)
								}
							/>

							<div class="col-span-5 row-start-2 text-center font-semibold text-3xl text-shadow-md text-shadow-neutral">
								Will you be my valentine ❤️?
							</div>

							<BaseDialog
								description={
									<div class="motion-preset-confetti flex flex-col items-center justify-center gap-4">
										<img
											alt="Valentine Gif"
											src={
												outroSettings().dialog.img ??
												getRandomArrayElement(PUBLIC_ASSETS["/gif-happy"])
											}
										/>

										{outroSettings().dialog.text}
									</div>
								}
								title={outroSettings().dialog.title}
								trigger={
									<BaseButton
										class="btn-primary btn-lg motion-safe:motion-preset-blink col-span-2 col-start-1 row-start-3 border-neutral shadow-md"
										onClick={handleYesBtnClick}
										ref={yesBtn$}
									>
										YES :D
									</BaseButton>
								}
							></BaseDialog>

							<BaseButton
								class="btn-secondary btn-lg wrap-anywhere relative col-span-2 col-start-4 row-start-3 shadow-md"
								disabled={
									outroSettings().noBtnAction.text === "scroll" && isAtEnd()
								}
								onClick={handleNoBtnClick}
								ref={noBtn$}
							>
								{data.text}
							</BaseButton>
						</Show>
					)}
				</For>
			</div>
		</div>
	);
}
