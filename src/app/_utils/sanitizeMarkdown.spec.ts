import { sanitizeMarkdown } from "./sanitizeMarkdown";
import DOMPurify from "dompurify";

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
		const originalWindow = global.window;
		delete (global as any).window; // Simulate server-side rendering

		const result = sanitizeMarkdown(
			"<script>alert('XSS')</script># Hello World"
		);
		expect(result).toBe("<script>alert('XSS')</script># Hello World");

		global.window = originalWindow; // Restore the original window object
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
