import { defineMiddleware } from "astro:middleware";
import { sessions, connections, users } from "./db/schema";
import { and, desc, eq, gte } from "drizzle-orm";
import { POST as getToken } from "./pages/api/refresh_token";
import db from "@/db";

// skip middleware for these routes
const PUBLIC_ROUTES = [
	"/",
	"/login",
	"/api/oauth_redirect",
	"/api/refresh_token",
	"/api/spotify/search",
];

export const onRequest = defineMiddleware(async (context, next) => {
	// todo: make this better, it's skipping the middleware for public routes
	if (
		PUBLIC_ROUTES.some(
			(path) =>
				path === context.url.pathname ||
				context.url.pathname.startsWith(`${path}/`),
		)
	) {
		return next();
	}

	const sqlite = db(context.locals.runtime.env.DB);
	const has_session = context.cookies.has("session");
	// if there is a session token, we need to check if it's valid
	if (!has_session) {
		return next(`/?redirect=${context.url.pathname}`);
	}

	const db_session = await sqlite.query.sessions.findFirst({
		where: and(
			eq(
				sessions.session_token,
				//confirmed the cookie is there
				context.cookies.get("session")?.value as string,
			),
			gte(sessions.expires, Date.now()),
		),
	});

	const current_user = await sqlite.query.users.findFirst({
		where: eq(users.id, db_session?.user_id ?? 0),
	});

	if (!current_user) {
		return next(`/?redirect=${context.url.pathname}`);
	}

	context.locals.user_data = current_user;

	const tokens = await sqlite.query.connections.findFirst({
		where: eq(connections.user_id, db_session?.user_id ?? 0),
		orderBy: [desc(connections.id)],
	});
	
	const expires_in_time = tokens?.expires_in ?? 0;
	const expire_date = new Date(Date.now() + expires_in_time * 1000);
	if (db_session && tokens && expire_date > new Date()) {
		context.locals.access_token = tokens.access_token as string;
		context.locals.refresh_token = tokens.refresh_token as string;
		return next();
	}
	const new_tokens = await getToken(context);
	if (new_tokens.status !== 201) {
		return context.redirect("/", 302);
	}
	const new_tokens_data: TokenResponse = await new_tokens.json();
	context.locals.access_token = new_tokens_data.access_token;
	context.locals.refresh_token = new_tokens_data.refresh_token;
	await sqlite
		.update(connections)
		.set({
			access_token: new_tokens_data.access_token,
			refresh_token: new_tokens_data.refresh_token,
			expires_in: new_tokens_data.expires_in,
		})
		.where(eq(connections.user_id, db_session?.user_id ?? 0));
	return next();
});
