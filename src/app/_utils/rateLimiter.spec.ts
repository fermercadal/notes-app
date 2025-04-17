import { rateLimiter } from "./rateLimiter";

jest.mock("next-rate-limit", () => ({
	__esModule: true,
	default: jest.fn(() => ({
		checkNext: jest.fn(async (req, limit) => {
			const ip = req.ip || "127.0.0.1";
			if (!global.rateLimitState) {
				global.rateLimitState = {};
			}
			if (!global.rateLimitState[ip]) {
				global.rateLimitState[ip] = 0;
			}
			if (global.rateLimitState[ip] >= limit) {
				throw new Error("Rate limit exceeded");
			}
			global.rateLimitState[ip]++;
			return { "X-RateLimit-Remaining": limit - global.rateLimitState[ip] };
		}),
	})),
}));

describe("rateLimiter", () => {
	beforeEach(() => {
		global.rateLimitState = {}; // Reset state before each test
	});

	it("allows requests under the limit", async () => {
		const mockRequest = { headers: {}, ip: "127.0.0.1" } as any;

		const headers = await rateLimiter.checkNext(mockRequest, 10);
		expect(headers).toBeDefined();
		expect(headers["X-RateLimit-Remaining"]).toBe(9);
	});

	it("throws an error when the rate limit is exceeded", async () => {
		const mockRequest = { headers: {}, ip: "127.0.0.1" } as any;

		await rateLimiter.checkNext(mockRequest, 1); // First request should pass
		await expect(rateLimiter.checkNext(mockRequest, 1)).rejects.toThrow(
			"Rate limit exceeded"
		);
	});
});
