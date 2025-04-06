import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".dev.vars" });

export default defineConfig({
	dialect: "sqlite",
	out: "./migrations",
	schema: "./src/db/schema.ts",
	dbCredentials: {
		url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/2e3e85ebd190b69cc1782e5adc585cba98c8d1f2499ddde68eb45b0ce84172dc.sqlite",
	},
});
