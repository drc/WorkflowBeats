import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || "World";

    return new Response(`Hello ${name}!`);
};
