import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const users = table(
	"users",
	{
		id: t.int().primaryKey({ autoIncrement: true }),
		name: t.text(),
		sys_id: t.text().notNull(),
	},
	(table) => [t.uniqueIndex("user_sys_id_idx").on(table.sys_id)],
);

export const sessions = table(
	"sessions",
	{
		id: t.int().primaryKey({ autoIncrement: true }),
		user_id: t.int().references(() => users.id),
		session_token: t.text().$default(() => generateUniqueString(16)),
		expires: t.integer().$default(() => Date.now() + 30 * 60 * 1000),
	},
	(table) => [
		t.index("session_user_idx").on(table.user_id),
		t.uniqueIndex("session_session_token_idx").on(table.session_token),
	],
);

export const connections = table(
    "connections",
    {
        id: t.int().primaryKey({ autoIncrement: true }),
        user_id: t.int().references(() => users.id),
        access_token: t.text(),
        refresh_token: t.text(),
        expires_in: t.integer(),
        provider: t.text(),
    },
    (table) => [
        t.index("conn_user_idx").on(table.user_id),
        t.index("conn_provider_idx").on(table.provider),
    ],
);

function generateUniqueString(length = 12): string {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let uniqueString = "";
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		uniqueString += characters[randomIndex];
	}
	return uniqueString;
}
