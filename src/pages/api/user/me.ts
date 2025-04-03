import type { APIRoute } from "astro";

interface UserResponse {
    result: {
        user_name: string;
        user_display_name: string;
        user_initials: string;
        user_avatar: string;
        user_sys_id: string;
    };
}

export const GET: APIRoute = async ({ locals }) => {
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
        return new Response("Unauthorized", { status: 401 });
    }
    const { result: data }: UserResponse = await response.json();

    return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
};
