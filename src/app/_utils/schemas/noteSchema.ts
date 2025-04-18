import { z } from "zod";

export const NoteSchema = z.object({
	content: z.string().min(1, "Note content is required"),
});
