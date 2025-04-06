// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
	output: "server",

	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),

	server: {
		allowedHosts: [
			".ngrok-free.app",
			".trycloudflare.com",
			"development.dancigrang.dev",
		],
	},

	integrations: [svelte()],
});
