import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".dev.vars" });

export default defineConfig({
	driver: "d1-http",
	schema: "./src/db/schema.ts",
	out: "./migrations",
	dialect: "sqlite",
	dbCredentials: {
		accountId:
			process.env.CLOUDFLARE_ACCOUNT_ID ??
			(() => {
				throw new Error("CLOUDFLARE_ACCOUNT_ID is not defined");
			})(),
		databaseId:
			process.env.CLOUDFLARE_DATABASE_ID ??
			(() => {
				throw new Error("CLOUDFLARE_DATABASE_ID is not defined");
			})(),
		token:
			process.env.CLOUDFLARE_D1_TOKEN ??
			(() => {
				throw new Error("CLOUDFLARE_D1_TOKEN is not defined");
			})(),
	},
});
