import { defineMiddleware } from "astro:middleware";

const PUBLIC_ROUTES = ["/", "/login", "/api/oauth_redirect", "/api/refresh_token"];

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware((context, next) => {
    if (!context.cookies.has("access_token") && !PUBLIC_ROUTES.includes(context.url.pathname)) {
        return context.redirect("/login", 302);
    }
    if (context.cookies.has("access_token") && context.url.pathname === "/login") {
        return context.redirect("/dashboard", 302);
    }

    return next();
});