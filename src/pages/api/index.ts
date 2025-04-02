import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, request }) => {
    return new Response(cookies.get("access_token")?.json().access_token, { status: 200 });
};