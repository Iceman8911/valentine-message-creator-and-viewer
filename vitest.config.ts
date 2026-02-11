import { defineConfig } from "vitest/config";

/**
 * Vitest workspace config (Vitest v4).
 *
 * We split tests into two projects so Solid component tests can run in `jsdom`
 * without breaking Node/Bun-only unit tests.
 */
export default defineConfig({
	workspace: ["./vitest.node.config.ts", "./vitest.dom.config.ts"],
});
