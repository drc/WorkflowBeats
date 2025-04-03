import type { APIRoute } from "astro";

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    expires_in: number;
    expiry_date: number;
}

export const GET: APIRoute = async ({ cookies, locals, request, redirect }) => {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    if (!code) {
        return redirect("/", 302);
    }
    const { runtime: { env } } = locals;
    const token_url = new URL(`https://${env.SERVICENOW_INSTANCE}/oauth_token.do`);
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
    const token_data: TokenResponse = await token_response.json();
    // compute expiry date when expires_in seconds from now
    token_data.expiry_date = Date.now() + token_data.expires_in * 1000;
    cookies.set("access_token", token_data, { path: "/", maxAge: 1800 });
    return redirect("/dashboard", 302);
}