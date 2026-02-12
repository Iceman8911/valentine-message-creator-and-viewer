import { render } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import RequiredAsterisk from "./RequiredAsterisk";

describe("RequiredAsterisk", () => {
	it("renders an asterisk", () => {
		const { getByText } = render(() => <RequiredAsterisk />);
		expect(getByText("*")).toBeInTheDocument();
	});

	it("applies the error text class", () => {
		const { getByText } = render(() => <RequiredAsterisk />);
		expect(getByText("*")).toHaveClass("text-error");
	});
});
