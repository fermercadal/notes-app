import { NextResponse } from "next/server";
import { z } from "zod";

export function handleError(error: unknown) {
	if (error instanceof z.ZodError) {
		return NextResponse.json(
			{ message: "Invalid input", errors: error.errors },
			{ status: 400 }
		);
	}

	if (error instanceof Error && error.message === "Rate limit exceeded") {
		return NextResponse.json(
			{ message: "Too many requests, please try again later" },
			{ status: 429 }
		);
	}

	console.log("Error processing request:", error);
	return NextResponse.json(
		{ message: "Internal Server Error" },
		{ status: 500 }
	);
}
