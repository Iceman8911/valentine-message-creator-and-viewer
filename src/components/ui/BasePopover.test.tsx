import { cleanup, fireEvent, render, within } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";
import BasePopover from "./BasePopover";

afterEach(() => {
	// Ensure each test is isolated:
	// - unmount Solid trees
	// - remove any portaled nodes appended to document.body by Popover.Portal
	cleanup();
	document.body.innerHTML = "";
});

describe("BasePopover", () => {
	it("renders the trigger, and does not show content by default", () => {
		const { getByRole } = render(() => (
			<BasePopover
				description={<span>Popover description</span>}
				title={<span>Popover title</span>}
				trigger={<span>Open popover</span>}
			/>
		));

		const trigger = getByRole("button", { name: "Open popover" });
		expect(trigger).toBeInTheDocument();

		const screen = within(document.body);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		expect(screen.queryByText("Popover title")).not.toBeInTheDocument();
		expect(screen.queryByText("Popover description")).not.toBeInTheDocument();
	});

	it("opens on trigger click and renders title/description", async () => {
		const { getByRole } = render(() => (
			<BasePopover
				description={<span>Description</span>}
				title={<span>Title</span>}
				trigger={<span>Open</span>}
			/>
		));

		fireEvent.click(getByRole("button", { name: "Open" }));

		const screen = within(document.body);

		const dialog = await screen.findByRole("dialog");
		expect(dialog).toBeInTheDocument();

		expect(screen.getByText("Title")).toBeInTheDocument();
		expect(screen.getByText("Description")).toBeInTheDocument();
	});

	it("applies provided class names to trigger/content/title/description/close button", async () => {
		const { getByRole } = render(() => (
			<BasePopover
				class={{
					closeBtn: "close-class",
					content: "c-class",
					description: "desc-class",
					title: "title-class",
					trigger: "t-class",
				}}
				description={<span>Description</span>}
				title={<span>Title</span>}
				trigger={<span>Open</span>}
			/>
		));

		const trigger = getByRole("button", { name: "Open" });
		expect(trigger).toHaveClass("t-class");

		fireEvent.click(trigger);

		const screen = within(document.body);
		const dialog = await screen.findByRole("dialog");

		// Assert classnames on the rendered elements without relying on text queries
		// (text nodes might not be unique across tests if cleanup fails).
		expect(dialog).toHaveClass("c-class");
		expect(dialog.querySelector(".title-class")).toBeTruthy();
		expect(dialog.querySelector(".desc-class")).toBeTruthy();
		expect(dialog.querySelector("button.close-class")).toBeTruthy();
	});

	it("passes through config props to trigger/content", async () => {
		const { getByRole } = render(() => (
			<BasePopover
				config={{
					content: { id: "my-content" },
					// Root config should not break rendering in tests; not asserting on it directly.
					root: { modal: true },
					//@ts-expect-error
					trigger: { "aria-label": "My trigger label", id: "my-trigger" },
				}}
				description={<span>Description</span>}
				title={<span>Title</span>}
				trigger={<span>Open</span>}
			/>
		));

		const trigger = getByRole("button", { name: "My trigger label" });
		expect(trigger).toHaveAttribute("id", "my-trigger");
		expect(trigger).toHaveAttribute("aria-label", "My trigger label");

		fireEvent.click(trigger);

		const screen = within(document.body);
		const dialog = await screen.findByRole("dialog");

		expect(dialog).toHaveAttribute("id", "my-content");
	});

	it("closes when close button is clicked", async () => {
		const { getByRole } = render(() => (
			<BasePopover
				class={{ closeBtn: "close-class" }}
				description={<span>Description</span>}
				title={<span>Title</span>}
				trigger={<span>Open</span>}
			/>
		));

		fireEvent.click(getByRole("button", { name: "Open" }));

		const screen = within(document.body);
		const dialog = await screen.findByRole("dialog");
		expect(dialog).toBeInTheDocument();
		expect(dialog).not.toHaveAttribute("data-closed");

		const closeBtn = dialog.querySelector("button.close-class");
		expect(closeBtn).toBeTruthy();

		fireEvent.click(closeBtn as HTMLButtonElement);

		// Kobalte Popover keeps the content in the DOM and toggles a "closed" state.
		// In jsdom, it's more reliable to assert this state than removal.
		expect(screen.getByRole("dialog")).toHaveAttribute("data-closed", "");
	});
});
