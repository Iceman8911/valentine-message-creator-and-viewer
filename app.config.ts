import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import lucidePreprocess from "vite-plugin-lucide-preprocess";

export default defineConfig({
	server: {
		baseURL: process.env["BASE_PATH"],
		preset: "github-pages",
	},
	ssr: false,
	vite: {
		plugins: [lucidePreprocess(), tailwindcss()],
	},
});
