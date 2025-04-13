module.exports = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}", // Include all files in the src directory
	],
	theme: {
		extend: {}, // Extend default Tailwind styles here
	},
	plugins: [
		require("@tailwindcss/typography"), // Add the Typography plugin
	],
};
