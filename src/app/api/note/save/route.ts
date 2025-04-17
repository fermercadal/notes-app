import { NextResponse, NextRequest } from "next/server";
import { rateLimiter } from "@utils/rateLimiter";
import { handleError } from "@utils/errorHandler";
import { NoteSchema } from "@utils/schemas/noteSchema";

export async function POST(req: NextRequest) {
	try {
		const headers = await rateLimiter.checkNext(req, 10);

		const body = await req.json();
		const { content } = NoteSchema.parse(body);

		// Placeholder for middleware to save the note to a database

		return NextResponse.json(
			{ message: "Note content received", content },
			{ status: 200, headers }
		);
	} catch (error) {
		return handleError(error);
	}
}
