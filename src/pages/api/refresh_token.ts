import type { APIRoute } from "astro";
import { constants as http } from "node:http2";

export const GET: APIRoute = async (context) => {
    return new Response("Method not allowed", { status: http.HTTP_STATUS_METHOD_NOT_ALLOWED });
}

export const POST: APIRoute = async (context) => {
    try {
        console.log("Token expired, refreshing...");
        if (!context.cookies.has("refresh_token")) {
            throw new Error("Unauthorized");
        }
        const refresh_token = context.cookies.get("refresh_token")?.value ?? "";
        const refresh_response = await fetch(`https://${context.locals.runtime.env.SERVICENOW_INSTANCE}/oauth_token.do`, {
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
        });
        if (!refresh_response.ok) {
            throw new Error("Bad Request - Invalid refresh token");
        }
        const auth: TokenResponse = await refresh_response.json();
        context.cookies.set("access_token", auth.access_token, { path: "/", maxAge: auth.expires_in, secure: true, httpOnly: true, sameSite: "strict" });
        context.cookies.set("refresh_token", auth.refresh_token, { path: "/", maxAge: 8640000, secure: true, httpOnly: true, sameSite: "strict" });

        return new Response(null, { status: http.HTTP_STATUS_CREATED, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.debug(error);
        return new Response(`Internal Server Error: ${error}`, { status: http.HTTP_STATUS_INTERNAL_SERVER_ERROR });
    }
};
