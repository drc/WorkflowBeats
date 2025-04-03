import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
    const { cookies, locals, request, redirect } = context;
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
    cookies.set("connected", "true", { path: "/", maxAge: 8640000 });
    cookies.set("access_token", token_data.access_token, { path: "/", maxAge: token_data.expires_in });
    cookies.set("refresh_token", token_data.refresh_token, { path: "/", maxAge: 8640000, secure: true, httpOnly: true, sameSite: "strict" });
    return redirect("/dashboard", 302);
}