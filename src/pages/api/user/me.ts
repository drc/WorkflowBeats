import type { APIRoute } from "astro";
import { constants as http } from "node:http2";

export const GET: APIRoute = async ({ locals }) => {
    try {
        const response = await fetch(
            `https://${locals.runtime.env.SERVICENOW_INSTANCE}/api/now/ui/user/current_user`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${locals.access_token}`,
                },
            },
        );
        if (!response.ok) {
            throw new Error("Unauthorized");
        }
        const { result: data }: UserResponse = await response.json();

        return new Response(JSON.stringify(data), { status: http.HTTP_STATUS_OK, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.debug(error);
        return new Response(`Internal Server Error: ${error}`, { status: http.HTTP_STATUS_INTERNAL_SERVER_ERROR });
    }
};
