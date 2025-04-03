import type { APIRoute } from "astro";

interface UserResponse {
    result: {
        user_name: string;
        user_display_name: string;
        user_initials: string;
        user_avatar: string;
    };
}

export const GET: APIRoute = async ({ params, locals }) => {
    const user_id = params.user_id;

    const response = await fetch(
        `https://${locals.runtime.env.SERVICENOW_INSTANCE}/api/now/ui/user/${user_id}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${locals.access_token}`,
            },
        },
    );
    const { result: data }: UserResponse = await response.json();

    return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
};
