import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Vitest doesn't automatically honor TypeScript `paths` mappings.
 * This config mirrors `tsconfig.json`:
 *   "~/*" -> "./src/*"
 */
export default defineConfig({
	resolve: {
		alias: {
			"~/": fileURLToPath(new URL("./src/", import.meta.url)),
		},
	},
	test: {
		// Keep defaults unless you have a specific environment/setup file
	},
});
