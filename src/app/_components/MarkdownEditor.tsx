"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import useDebounce from "@hooks/useDebounce";
import useSubmitNote from "@hooks/useSubmitNote";
import { sanitizeMarkdown } from "@utils/sanitizeMarkdown";

export default function MarkdownEditor() {
	const [markdown, setMarkdown] = useState("");

	const submitNote = useSubmitNote();

	const debouncedMarkdown = useDebounce(markdown, 300);
	const sanitizedMarkdown = sanitizeMarkdown(debouncedMarkdown);

	const onMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMarkdown(e.target.value);
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(markdown);
			alert("Markdown content copied to clipboard!");
		} catch (err) {
			console.log("Failed to copy content.", { err });
			alert("Failed to copy content.");
		}
	};

	const handleSubmit = async () => {
		try {
			await submitNote(markdown);
			alert("Note submitted successfully!");
		} catch (err) {
			console.log("Failed to submit the note.", { err });
			alert("Failed to submit the note.");
		}
	};

	return (
		<div className="flex flex-col gap-8 w-full max-w-4xl">
			<textarea
				className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				placeholder="Write your markdown here..."
				value={markdown}
				onChange={onMarkdownChange}
			/>

			<div className="prose prose-sm w-full h-64 p-4 border border-gray-300 bg-gray-100 rounded-md overflow-auto">
				<ReactMarkdown>{sanitizedMarkdown}</ReactMarkdown>
			</div>

			<div className="flex gap-4 mt-4">
				<button
					className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
					onClick={handleCopy}
				>
					Copy Markdown
				</button>
				<button
					className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
					onClick={handleSubmit}
				>
					Submit Note
				</button>
			</div>
		</div>
	);
}
