import { sanitizeMarkdown } from "./sanitizeMarkdown";

jest.mock("dompurify", () => ({
	__esModule: true,
	default: jest.fn(() => ({
		sanitize: jest.fn((input: string) =>
			input.replace(/<script.*?>.*?<\/script>/g, "")
		),
	})),
}));

describe("sanitizeMarkdown", () => {
	it("returns the input as-is when running on the server", () => {
		// Temporarily remove `window` from the global object
		const originalWindow = global.window;
		Object.defineProperty(global, "window", {
			value: undefined,
			configurable: true,
		});

		const result = sanitizeMarkdown(
			"<script>alert('XSS')</script># Hello World"
		);
		expect(result).toBe("<script>alert('XSS')</script># Hello World");

		// Restore the original `window` object
		Object.defineProperty(global, "window", {
			value: originalWindow,
			configurable: true,
		});
	});

	it("sanitizes the input markdown on the client", () => {
		const result = sanitizeMarkdown(
			"<script>alert('XSS')</script># Hello World"
		);
		expect(result).toBe("# Hello World");
	});

	it("does not modify safe markdown content", () => {
		const result = sanitizeMarkdown("# Hello World");
		expect(result).toBe("# Hello World");
	});
});
