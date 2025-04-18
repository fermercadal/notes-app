import { renderHook, act } from "@testing-library/react";
import useDebounce from "./useDebounce";

jest.useFakeTimers();

describe("useDebounce", () => {
	it("returns the initial value immediately", () => {
		const { result } = renderHook(() => useDebounce("initial", 500));
		expect(result.current).toBe("initial");
	});

	it("updates the debounced value after the delay", () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{
				initialProps: { value: "initial", delay: 500 },
			}
		);

		rerender({ value: "updated", delay: 500 });

		// Before the delay, the value should still be the initial value
		expect(result.current).toBe("initial");

		// Fast-forward time by 500ms
		act(() => {
			jest.advanceTimersByTime(500);
		});

		// After the delay, the value should be updated
		expect(result.current).toBe("updated");
	});

	it("cancels the timeout if the value changes before the delay", () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{
				initialProps: { value: "initial", delay: 500 },
			}
		);

		rerender({ value: "intermediate", delay: 500 });

		// Fast-forward time by 300ms (less than the delay)
		act(() => {
			jest.advanceTimersByTime(300);
		});

		// The value should still be the initial value
		expect(result.current).toBe("initial");

		// Rerender with a new value before the delay completes
		rerender({ value: "final", delay: 500 });

		// Fast-forward time by 500ms
		act(() => {
			jest.advanceTimersByTime(500);
		});

		// The value should now be the final value
		expect(result.current).toBe("final");
	});

	it("uses the latest delay value if it changes", () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{
				initialProps: { value: "initial", delay: 500 },
			}
		);

		rerender({ value: "updated", delay: 1000 });

		// Fast-forward time by 500ms (less than the new delay)
		act(() => {
			jest.advanceTimersByTime(500);
		});

		// The value should still be the initial value
		expect(result.current).toBe("initial");

		// Fast-forward time by another 500ms (total 1000ms)
		act(() => {
			jest.advanceTimersByTime(500);
		});

		// The value should now be updated
		expect(result.current).toBe("updated");
	});
});
