import { defineMiddleware } from "astro:middleware";
import { POST as refresh_token } from "@/pages/api/refresh_token";

// skip middleware for these routes
const PUBLIC_ROUTES = ["/", "/login", "/api/oauth_redirect", "/api/refresh_token"];

export const onRequest = defineMiddleware(async (context, next) => {
    let has_access_token = context.cookies.has("access_token");
    const has_refresh_token = context.cookies.has("refresh_token");
    let valid_user_session = has_access_token && has_refresh_token;
    console.log({ valid_user_session })
    // not a public route, so we need to check for access tokens
    if (!valid_user_session) {
        if (!PUBLIC_ROUTES.includes(context.url.pathname)) {
            return context.redirect("/login", 302);
        }
    }
    // one of the parts of the session is missing
    if (!has_access_token && has_refresh_token) {
        const refresh_response = await refresh_token(context);

        // unable to refresh the access token, redirect to login
        if (refresh_response.status !== 201) {
            return context.redirect("/login", 302);
        }
        has_access_token = context.cookies.has("access_token");
        valid_user_session = has_access_token && has_refresh_token;
        
        if (valid_user_session && context.url.pathname === "/login") {
            return context.redirect("/dashboard", 302);
        }
        return next();
    }

    if (valid_user_session && context.url.pathname === "/login") {
        return context.redirect("/dashboard", 302);
    }
    // if we're here, we have an access token
    context.locals.access_token = context.cookies.get("access_token")?.value ?? "";
    context.locals.refresh_token = context.cookies.get("refresh_token")?.value ?? "";

    return next();
});