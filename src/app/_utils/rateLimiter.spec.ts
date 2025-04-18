import { rateLimiter } from "./rateLimiter";
import { NextRequest } from "next/server";

jest.mock("next-rate-limit", () => ({
	__esModule: true,
	default: jest.fn(() => {
		// Use a local in-memory state instead of modifying `global`
		const rateLimitState: Record<string, number> = {};

		return {
			checkNext: jest.fn(async (req, limit) => {
				const ip = req.ip || "127.0.0.1";
				if (!rateLimitState[ip]) {
					rateLimitState[ip] = 0;
				}
				if (rateLimitState[ip] >= limit) {
					return {
						headers: new Headers(),
						exceeded: true, // Indicate that the rate limit has been exceeded
					};
				}
				rateLimitState[ip]++;
				const headers = new Headers();
				headers.set(
					"X-RateLimit-Remaining",
					(limit - rateLimitState[ip]).toString()
				);
				return { headers, exceeded: false };
			}),
		};
	}),
}));

// Extend the NextRequest type to include the `ip` property
interface MockNextRequest extends NextRequest {
	ip: string;
}

// Mock the NextRequest object
const createMockRequest = (ip: string): MockNextRequest =>
	({
		headers: new Headers(),
		ip,
	} as MockNextRequest);

describe("rateLimiter", () => {
	it("allows requests under the limit", async () => {
		const mockRequest = createMockRequest("127.0.0.1");

		// Call the mocked rateLimiter
		const result = await rateLimiter.checkNext(mockRequest, 10);

		// Assert the returned object structure
		expect(result.headers).toBeDefined();
		expect(result.headers.get("X-RateLimit-Remaining")).toBe("9");
		expect(result.exceeded).toBe(false); // Ensure the rate limit has not been exceeded
	});

	it("indicates when the rate limit is exceeded", async () => {
		const mockRequest = createMockRequest("127.0.0.1");

		// First request should pass
		await rateLimiter.checkNext(mockRequest, 1);

		// Second request should indicate the rate limit is exceeded
		const result = await rateLimiter.checkNext(mockRequest, 1);
		expect(result.headers).toBeDefined();
		expect(result.exceeded).toBe(true);
	});
});
