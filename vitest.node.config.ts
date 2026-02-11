import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Vitest project: Node (default)
 *
 * Keep the runtime Node-like (Bun/Node) so tests that rely on Node/Bun APIs
 * (e.g. Web Streams/Blob implementations) don't break due to jsdom shims.
 *
 * This intentionally excludes Solid component tests (those run in the jsdom project).
 */
export default defineConfig({
	resolve: {
		alias: {
			// Match tsconfig.json paths: "~/*" -> "./src/*"
			"~/": fileURLToPath(new URL("./src/", import.meta.url)),
		},
	},
	test: {
		environment: "node",
		exclude: ["src/components/**/*.test.tsx"],
		include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
		name: "unit",
	},
});
