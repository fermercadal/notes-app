import { handleError } from "./errorHandler";
import { NextResponse } from "next/server";
import { z } from "zod";

jest.mock("next/server", () => ({
	NextResponse: {
		json: jest.fn((body, { status }) => ({ body, status })),
	},
}));

describe("handleError", () => {
	it("returns a 400 response for ZodError", () => {
		const zodError = new z.ZodError([
			{
				path: ["content"],
				message: "Content is required",
				code: "invalid_type",
			},
		]);

		const response = handleError(zodError);
		expect(NextResponse.json).toHaveBeenCalledWith(
			{ message: "Invalid input", errors: zodError.errors },
			{ status: 400 }
		);
		expect(response).toEqual({
			body: { message: "Invalid input", errors: zodError.errors },
			status: 400,
		});
	});

	it("returns a 429 response for rate limit exceeded error", () => {
		const rateLimitError = new Error("Rate limit exceeded");

		const response = handleError(rateLimitError);
		expect(NextResponse.json).toHaveBeenCalledWith(
			{ message: "Too many requests, please try again later" },
			{ status: 429 }
		);
		expect(response).toEqual({
			body: { message: "Too many requests, please try again later" },
			status: 429,
		});
	});

	it("returns a 500 response for unknown errors", () => {
		const unknownError = new Error("Something went wrong");

		const response = handleError(unknownError);
		expect(NextResponse.json).toHaveBeenCalledWith(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
		expect(response).toEqual({
			body: { message: "Internal Server Error" },
			status: 500,
		});
	});

	it("logs the error for unknown errors", () => {
		const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
		const unknownError = new Error("Something went wrong");

		handleError(unknownError);
		expect(consoleSpy).toHaveBeenCalledWith(
			"Error processing request:",
			unknownError
		);

		consoleSpy.mockRestore();
	});
});
