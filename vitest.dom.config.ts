import { fileURLToPath, URL } from "node:url";
import solid from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

/**
 * Vitest project: DOM (jsdom) for Solid component tests.
 *
 * This isolates jsdom to component tests so Node/Bun-only unit tests keep
 * their native runtime behavior.
 */
export default defineConfig({
	plugins: [solid()],
	resolve: {
		alias: {
			// Match tsconfig.json paths: "~/*" -> "./src/*"
			"~/": fileURLToPath(new URL("./src/", import.meta.url)),
		},
		// SolidStart/Solid packages use export conditions; ensure browser-friendly modules in DOM tests.
		conditions: ["development", "browser"],
	},
	test: {
		environment: "jsdom",
		include: ["src/components/**/*.test.tsx"],
		name: "dom",
	},
});
