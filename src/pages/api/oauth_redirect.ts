import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { connections, sessions, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async (context) => {
	const { cookies, locals, request, redirect } = context;
	const code = new URL(request.url).searchParams?.get("code");
	const state = new URL(request.url).searchParams?.get("state");

	const storedState = cookies.get("state")?.value;

	if (!code || state !== storedState) {
		return redirect("/?error=Server+Error", 302);
	}

	const {
		runtime: { env },
	} = locals;

	const token_url = new URL(
		`https://${env.SERVICENOW_INSTANCE}/oauth_token.do`,
	);
	token_url.searchParams.set("grant_type", "authorization_code");
	token_url.searchParams.set("code", code);
	token_url.searchParams.set(
		"redirect_uri",
		`https://${context.url.host}/api/oauth_redirect`,
	);
	token_url.searchParams.set("client_id", env.SERVICENOW_CLIENT_ID);
	token_url.searchParams.set("client_secret", env.SERVICENOW_CLIENT_SECRET);

	const token_response = await fetch(token_url, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});

	const token_data: TokenResponse = await token_response.json();
	console.log("Retrieved token data");
	const current_user_response = await fetch(
		`https://${locals.runtime.env.SERVICENOW_INSTANCE}/api/now/ui/user/current_user`,
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${token_data.access_token}`,
			},
		},
	);
	if (!current_user_response.ok) {
		throw new Error("Unauthorized");
	}
	const { result: user_data }: UserResponse =
		await current_user_response.json();
	console.log("Retrieved user data");
	const db = drizzle(context.locals.runtime.env.DB);
	let userDBData = await db
		.select()
		.from(users)
		.where(eq(users.sys_id, user_data.user_sys_id))
		.limit(1);
	if (userDBData.length === 0) {
		userDBData = await db
			.insert(users)
			.values({
				name: user_data.user_display_name,
				sys_id: user_data.user_sys_id,
				avatar_url: user_data.user_avatar,
			})
			.returning();
	}
	console.log("User data saved to database");
	await db.insert(connections).values({
		user_id: userDBData[0]?.id,
		access_token: token_data.access_token,
		refresh_token: token_data.refresh_token,
		expires_in: token_data.expires_in,
		provider: "servicenow",
	});
	console.log("Connection data saved to database");
	const [session] = await db
		.insert(sessions)
		.values({
			user_id: userDBData[0]?.id ?? 1,
		})
		.returning();
	console.log("Session data saved to database");
	cookies.set("session", session.session_token as string, {
		path: "/",
		expires: new Date(session.expires as number),
		secure: true,
		httpOnly: true,
	});
	return redirect("/dashboard", 302);
};
