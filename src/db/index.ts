import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export const db = (connection: D1Database) => {
	return drizzle(connection, {
		schema,
	});
};

export type db = typeof db;

export default db;
