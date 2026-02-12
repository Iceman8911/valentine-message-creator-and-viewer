import { cleanup, fireEvent, render, within } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";
import InfoButtonPopover from "./InfoButtonPopover";

afterEach(() => {
	// Ensure each test is isolated:
	// - unmount Solid trees
	// - remove any portaled nodes appended to document.body by Popover.Portal
	cleanup();
	document.body.innerHTML = "";
});

describe("InfoButtonPopover", () => {
	it("renders an icon trigger button and does not show content by default", () => {
		const { getByRole } = render(() => (
			<InfoButtonPopover
				description={<span>Popover description</span>}
				title={<span>Popover title</span>}
			/>
		));

		const trigger = getByRole("button");
		expect(trigger).toBeInTheDocument();

		// The trigger is an icon; assert it rendered via SVG presence.
		expect(trigger.querySelector("svg")).toBeTruthy();

		const screen = within(document.body);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		expect(screen.queryByText("Popover title")).not.toBeInTheDocument();
		expect(screen.queryByText("Popover description")).not.toBeInTheDocument();
	});

	it("opens on trigger click and renders title/description", async () => {
		const { getByRole } = render(() => (
			<InfoButtonPopover
				description={<span>Description</span>}
				title={<span>Title</span>}
			/>
		));

		fireEvent.click(getByRole("button"));

		const screen = within(document.body);
		const dialog = await screen.findByRole("dialog");
		expect(dialog).toBeInTheDocument();

		expect(screen.getByText("Title")).toBeInTheDocument();
		expect(screen.getByText("Description")).toBeInTheDocument();
	});

	it("merges trigger classes with base button classes", () => {
		const { getByRole } = render(() => (
			<InfoButtonPopover
				class={{ trigger: "my-trigger-class" }}
				description={<span>Description</span>}
				title={<span>Title</span>}
			/>
		));

		const trigger = getByRole("button");

		// Default trigger styling injected by InfoButtonPopover
		expect(trigger).toHaveClass("btn");
		expect(trigger).toHaveClass("btn-circle");
		expect(trigger).toHaveClass("btn-soft");
		expect(trigger).toHaveClass("btn-xs");

		// User-provided trigger class should be preserved/merged
		expect(trigger).toHaveClass("my-trigger-class");
	});
});
