import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals, url: { searchParams } }) => {
	try {
		if (!searchParams.has("q")) {
			throw new Error("Missing query parameter");
		}
		const query = searchParams.get("q") ?? "";
		// TODO: this should be spotify middleware
		let token = await locals.runtime.env.workflowbeats.get(
			"spotify_auth_token",
			"text",
		);
		if (!token) {
			const credentials = Buffer.from(
				`${locals.runtime.env.SPOTIFY_CLIENT_ID}:${locals.runtime.env.SPOTIFY_CLIENT_SECRET}`,
			).toString("base64");

			const spotify_response = await fetch(
				"https://accounts.spotify.com/api/token",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: `Basic ${credentials}`,
					},
					body: new URLSearchParams({
						grant_type: "client_credentials",
					}),
				},
			);

			const { access_token, expires_in }: SpotifyAuthResponse =
				await spotify_response.json();

			token = access_token;

			await locals.runtime.env.workflowbeats.put(
				"spotify_auth_token",
				access_token,
				{
					expirationTtl: expires_in,
				},
			);
		}

		const spotify_host = "https://api.spotify.com/v1";
		const spotify_search_url = new URL(`${spotify_host}/search`);
		spotify_search_url.searchParams.set("q", query);
		spotify_search_url.searchParams.set("type", "track");
		spotify_search_url.searchParams.set("market", "US");
		spotify_search_url.searchParams.set("limit", "5");

		const spotify_search_response = await fetch(spotify_search_url.toString(), {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!spotify_search_response.ok) {
			throw new Error("Spotify search failed");
		}

		const search_response = await spotify_search_response.json();

		return new Response(JSON.stringify(search_response), {
			status: spotify_search_response.status,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-store",
			},
		});
	} catch (error) {
		return new Response(`${error}`, { status: 500 });
	}
};
