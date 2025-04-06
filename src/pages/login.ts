import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url, locals, cookies }) => {
    try {
        const state = crypto.randomUUID()
        cookies.set("state", state, { path: "/", maxAge: 8640000 });
        const { env } = locals.runtime;
        const login_url = new URL(`https://${env.SERVICENOW_INSTANCE}/oauth_auth.do`);
        login_url.searchParams.set("response_type", "code");
        login_url.searchParams.set("redirect_uri", `${url.origin}/api/oauth_redirect`);
        login_url.searchParams.set("client_id", env.SERVICENOW_CLIENT_ID);
        login_url.searchParams.set("state", state);

        return new Response(null, {
            status: 302,
            headers: {
                Location: login_url.toString(),
            },
        });
    } catch (error) {
        console.debug(error);
        return new Response(`Internal Server Error: ${error}`, { status: 401 });
    }
};
