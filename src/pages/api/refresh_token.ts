import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
	return new Response("Method not allowed", { status: 405 });
};

export const POST: APIRoute = async (context) => {
	try {
		console.log("Token expired, refreshing...");

		const refresh_token = context.locals.refresh_token;
		const refresh_response = await fetch(
			`https://${context.locals.runtime.env.SERVICENOW_INSTANCE}/oauth_token.do`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					grant_type: "refresh_token",
					refresh_token: refresh_token,
					client_id: context.locals.runtime.env.SERVICENOW_CLIENT_ID,
					client_secret: context.locals.runtime.env.SERVICENOW_CLIENT_SECRET,
				}),
			},
		);
		if (!refresh_response.ok) {
			throw new Error("Bad Request - Invalid refresh token");
		}
		const auth: TokenResponse = await refresh_response.json();

		return new Response(JSON.stringify(auth), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.debug(error);
		return new Response(`Internal Server Error: ${error}`, { status: 500 });
	}
};
