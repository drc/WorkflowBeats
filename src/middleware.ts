import { defineMiddleware } from "astro:middleware";
import type { TokenResponse } from "./pages/api/oauth_redirect";

const PUBLIC_ROUTES = ["/", "/login", "/api/oauth_redirect", "/api/refresh_token"];

export const onRequest = defineMiddleware(async (context, next) => {
    if (!context.cookies.has("access_token") && !PUBLIC_ROUTES.includes(context.url.pathname)) {
        return context.redirect("/login", 302);
    }

    if (context.cookies.has("access_token")) {
        let auth: TokenResponse = context.cookies.get("access_token")?.json();
        if (auth.expiry_date < Date.now()) {
            const refresh_response = await fetch(`https://${context.locals.runtime.env.SERVICENOW_INSTANCE}/oauth_token.do`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: auth.refresh_token,
                    client_id: context.locals.runtime.env.SERVICENOW_CLIENT_ID,
                    client_secret: context.locals.runtime.env.SERVICENOW_CLIENT_SECRET,
                }),
            });
            auth = await refresh_response.json();
            context.cookies.set("access_token", auth, { path: "/", maxAge: 1800 });
        }
        context.locals.access_token = auth?.access_token;
        if (context.url.pathname === "/login") {
            return context.redirect("/dashboard", 302);
        }
    }

    return next();
});