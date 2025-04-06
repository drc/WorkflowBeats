import { defineMiddleware } from "astro:middleware";
import { drizzle } from "drizzle-orm/d1";
import { sessions } from "./db/schema";
import { and, eq, gt } from "drizzle-orm";

// skip middleware for these routes
const PUBLIC_ROUTES = [
	"/",
	"/login",
	"/api/oauth_redirect",
	"/api/refresh_token",
	"/api/spotify/search",
];

export const onRequest = defineMiddleware(async (context, next) => {
	const db = drizzle(context.locals.runtime.env.DB);
	const has_session = context.cookies.has("session");
	// if there is a session token, we need to check if it's valid
	if (!has_session) {
		return next("/");
	}
	const db_session = await db
		.select()
		.from(sessions)
		.where(
			and(
				eq(
					sessions.session_token,
					//confirmed the cookie is there
					context.cookies.get("session")?.value as string,
				),
				gt(sessions.expires, Date.now()),
			),
		);
	console.log({ db_session });
	if (db_session.length > 0) return next();
	return context.redirect("/", 302);
});
