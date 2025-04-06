import type { APIRoute } from "astro";
import { GET as getUser } from "@/pages/api/user/me";
import { drizzle } from "drizzle-orm/d1";
import { sessions, users } from "@/db/schema";
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
	token_url.searchParams.set("redirect_uri", env.SERVICENOW_REDIRECT_URI);
	token_url.searchParams.set("client_id", env.SERVICENOW_CLIENT_ID);
	token_url.searchParams.set("client_secret", env.SERVICENOW_CLIENT_SECRET);

	const token_response = await fetch(token_url, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});

	// TODO: Make a user session saved in database and not store these in cookies
	const token_data: TokenResponse = await token_response.json();
	console.log(token_data);
	context.locals.access_token = token_data.access_token;
	context.locals.refresh_token = token_data.refresh_token;
	const user_response = await getUser(context);
	const user_data: ProxyUserResponse = await user_response.json();
	console.log(user_data);
	const db = drizzle(context.locals.runtime.env.DB);
	let userDBData = await db
		.select()
		.from(users)
		.where(eq(users.sys_id, user_data.user_sys_id))
		.limit(1);
	console.log({ userDBData });
	if (userDBData.length === 0) {
		userDBData = await db
			.insert(users)
			.values({
				name: user_data.user_name,
				sys_id: user_data.user_sys_id,
			})
			.returning();
		console.log({ userDBData });
	}
	const [session] = await db
		.insert(sessions)
		.values({
			user_id: userDBData[0]?.id ?? 1,
		})
		.returning();
	cookies.set("session", session.session_token as string, {
		path: "/",
		maxAge: session.expires as number,
		secure: true,
		httpOnly: true,
	});
	return redirect("/dashboard", 302);
};
