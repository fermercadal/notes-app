import { useCallback } from "react";

const useSubmitNote = () => {
	const submitNote = useCallback(async (content: string) => {
		try {
			const response = await fetch("/api/note/save", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ content }),
			});

			if (!response.ok) {
				throw new Error("Failed to save note");
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}, []);

	return submitNote;
};

export default useSubmitNote;
