import type { APIRoute } from "astro";

interface TokenResponse {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    expires_in: number;
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
    cookies.set("access_token", token_data, {path: "/"});
    return redirect("/dashboard", 302);
}