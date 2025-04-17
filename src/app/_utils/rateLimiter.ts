import rateLimit from "next-rate-limit";

export const rateLimiter = rateLimit({
	interval: 60 * 1000, // 1 minute
	uniqueTokenPerInterval: 500, // Max 500 unique IPs per minute
});
