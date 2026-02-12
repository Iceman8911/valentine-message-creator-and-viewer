import { render } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import BaseButton from "./BaseButton";

describe("BaseButton", () => {
	it("renders a button with type='button' by default", () => {
		const { getByRole } = render(() => <BaseButton>Click me</BaseButton>);

		const button = getByRole("button", { name: "Click me" });
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute("type", "button");
	});

	it("combines the base 'btn' class with a provided class", () => {
		const { getByRole } = render(() => (
			<BaseButton class="primary">Save</BaseButton>
		));

		const button = getByRole("button", { name: "Save" });
		expect(button).toHaveClass("btn");
		expect(button).toHaveClass("primary");
	});

	it("still includes the base 'btn' class even when no class is provided", () => {
		const { getByRole } = render(() => <BaseButton>Ok</BaseButton>);

		const button = getByRole("button", { name: "Ok" });
		expect(button).toHaveClass("btn");
	});

	it("passes through other button props (e.g. disabled, aria-label)", () => {
		const { getByRole } = render(() => (
			<BaseButton aria-label="Submit form" disabled>
				Submit
			</BaseButton>
		));

		const button = getByRole("button", { name: "Submit form" });
		expect(button).toBeDisabled();
		expect(button).toHaveAttribute("aria-label", "Submit form");
	});

	it("wires onClick handler", async () => {
		const onClick = vi.fn();

		const { getByRole } = render(() => (
			<BaseButton onClick={onClick}>Press</BaseButton>
		));

		const button = getByRole("button", { name: "Press" });
		button.click();

		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
