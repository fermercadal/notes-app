/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require("next/jest");

const createJestConfig = nextJest({
	dir: "./",
});

const customJestConfig = {
	testEnvironment: "jest-environment-jsdom",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	collectCoverage: true,
	collectCoverageFrom: [
		"src/**/*.{ts,tsx}",
		"!src/**/*.d.ts",
		"!src/**/index.ts",
		"!src/app/**/route.ts",
		"!src/app/_utils/schemas/**",
		"!src/app/page.tsx",
		"!src/app/layout.tsx",
		"!src/app/_components/MarkdownEditor.tsx",
	],
	coverageDirectory: "coverage",
	coverageReporters: ["json", "lcov", "text", "clover"],
	moduleNameMapper: {
		"^@/hooks/(.*)$": "<rootDir>/app/_hooks/$1",
		"^@/utils/(.*)$": "<rootDir>/app/_utils/$1",
		"^@/components/(.*)$": "<rootDir>/app/_components/$1",
	},
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
};

module.exports = createJestConfig(customJestConfig);
