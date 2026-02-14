import { A, useParams, useSearchParams } from "@solidjs/router";
import { createMemo, ErrorBoundary, For, Show } from "solid-js";
import * as v from "valibot";
import BaseButton from "~/components/ui/BaseButton";
import ValentineMessageCreateIntroForm from "~/components/valentine-message-creation/ValentineMessageCreateIntroForm";
import ValentineMessageCreateOutroForm from "~/components/valentine-message-creation/ValentineMessageCreateOutroForm";

const RouteOptionSchema = v.picklist(["intro", "outro"]);

const RouteParamsSchema = v.object({
	mode: RouteOptionSchema,
});
type RouteParamsOutput = v.InferOutput<typeof RouteParamsSchema>;

const SearchParamsSchema = v.fallback(v.object({ data: v.string() }), {
	data: "",
});
type SearchParamsInput = v.InferInput<typeof SearchParamsSchema>;

export default function ValentineMessageCreationFormPage() {
	const routeParams = useParams();

	const [rawSearchParams, _setSearchParams] = useSearchParams();
	const usefulSearchParams = createMemo(() =>
		v.parse(SearchParamsSchema, rawSearchParams),
	);
	const setSearchParams = (input: string) => {
		const payload: SearchParamsInput = {
			data: input,
		};

		_setSearchParams(payload);
	};

	const parsedResult = createMemo(() =>
		v.safeParse(RouteParamsSchema, routeParams),
	);

	return (
		<div class="grid size-full place-items-center">
			<Show
				fallback={
					<div>
						<p>
							Error:{" "}
							<For each={parsedResult().issues}>
								{(issue) => <span class="text-info">{issue.message}</span>}
							</For>
						</p>
						You're likely not on the right route, so try loading up the intro
						creation page:{" "}
						<A class="link link-primary" href="/create/intro">
							Intro Page
						</A>
					</div>
				}
				when={
					parsedResult().success && (parsedResult().output as RouteParamsOutput)
				}
			>
				{(output) => (
					<ErrorBoundary
						fallback={(error, reset) => (
							<div class="grid place-items-center gap-4">
								<p>
									Something went wrong:{" "}
									<span class="text-info">{error.message}</span>
								</p>
								<BaseButton onClick={reset}>Try Again</BaseButton>
							</div>
						)}
					>
						<Show
							fallback={
								<ValentineMessageCreateOutroForm
									params={usefulSearchParams().data}
									setParams={setSearchParams}
								/>
							}
							when={output().mode === "intro"}
						>
							<ValentineMessageCreateIntroForm
								params={usefulSearchParams().data}
								setParams={setSearchParams}
							/>
						</Show>
					</ErrorBoundary>
				)}
			</Show>
		</div>
	);
}
