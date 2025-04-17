import DOMPurify from "dompurify";

export function sanitizeMarkdown(markdown: string): string {
	if (typeof window === "undefined") {
		return markdown; // Return as-is for server-side rendering
	}

	const DOMPurifyInstance = DOMPurify(window);
	return DOMPurifyInstance.sanitize(markdown);
}
