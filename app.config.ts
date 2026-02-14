import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import lucidePreprocess from "vite-plugin-lucide-preprocess";

export default defineConfig({
	server: {
		baseURL: process.env["BASE_PATH"],
		prerender: {
			crawlLinks: true,
			routes: ["/", "/create/intro", "/create/outro", "/view"],
		},
		preset: "github-pages",
	},
	vite: {
		plugins: [lucidePreprocess(), tailwindcss()],
	},
});
