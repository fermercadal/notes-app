import { renderHook } from "@testing-library/react";
import useSubmitNote from "./useSubmitNote";

global.fetch = jest.fn();

describe("useSubmitNote", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("successfully submits a note", async () => {
		const mockResponse = { message: "Note saved successfully" };
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: jest.fn().mockResolvedValueOnce(mockResponse),
		});

		const { result } = renderHook(() => useSubmitNote());
		const submitNote = result.current;

		const response = await submitNote("Test note");

		expect(fetch).toHaveBeenCalledWith("/api/note/save", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ content: "Test note" }),
		});
		expect(response).toEqual(mockResponse);
	});

	it("throws an error if the response is not ok", async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: false,
		});

		const { result } = renderHook(() => useSubmitNote());
		const submitNote = result.current;

		await expect(submitNote("Test note")).rejects.toThrow(
			"Failed to save note"
		);

		expect(fetch).toHaveBeenCalledWith("/api/note/save", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ content: "Test note" }),
		});
	});

	it("throws an error if fetch fails", async () => {
		(global.fetch as jest.Mock).mockRejectedValueOnce(
			new Error("Network error")
		);

		const { result } = renderHook(() => useSubmitNote());
		const submitNote = result.current;

		await expect(submitNote("Test note")).rejects.toThrow("Network error");

		expect(fetch).toHaveBeenCalledWith("/api/note/save", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ content: "Test note" }),
		});
	});
});
