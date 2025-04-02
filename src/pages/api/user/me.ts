import type { APIRoute } from "astro";

interface UserResponse {
    result: {
        user_name: string;
        user_display_name: string;
        user_initials: string;
        user_avatar: string;
    };
}

export const GET: APIRoute = async ({ cookies, locals }) => {
    const { access_token } = cookies.get("access_token")?.json() ?? { access_token: null };

    const response = await fetch(
        `https://${locals.runtime.env.SERVICENOW_INSTANCE}/api/now/ui/user/current_user`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        },
    );
    const { result: data }: UserResponse = await response.json();
    console.log(data);
    const avatar_response = await fetch(`https://${locals.runtime.env.SERVICENOW_INSTANCE}/${data.user_avatar.substring(0, data.user_avatar.indexOf(("?")))}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    const avatar_data = await avatar_response.blob();
    return new Response(avatar_data, { status: 200, headers: { "Content-Type": "image/png" } });
};
