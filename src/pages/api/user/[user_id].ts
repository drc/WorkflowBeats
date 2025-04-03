import type { APIRoute } from "astro";
import { constants as http } from "node:http2";
import { z } from "zod";




export const GET: APIRoute = async ({ params, locals }) => {
    const id = z.string().regex(/^[a-zA-Z0-9]{32}$/, "Invalid user ID");
    const user_id = id.safeParse(params.user_id);
    if (!user_id.success) {
        return new Response("Invalid user ID", { status: http.HTTP_STATUS_BAD_REQUEST });
    }

    const response = await fetch(
        `https://${locals.runtime.env.SERVICENOW_INSTANCE}/api/now/ui/user/${user_id.data}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${locals.access_token}`,
            },
        },
    );
    const { result: data }: UserResponse = await response.json();

    return new Response(JSON.stringify(data), { status: http.HTTP_STATUS_OK, headers: { "Content-Type": "application/json" } });
};
