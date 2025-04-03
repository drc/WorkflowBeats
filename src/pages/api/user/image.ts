import type { APIRoute } from "astro";
import { GET as GET_me } from "@/pages/api/user/me";

interface ProxyUserResponse {
    user_name: string;
    user_display_name: string;
    user_initials: string;
    user_avatar: string;
}

export const GET: APIRoute = async (context) => {
    const { locals } = context;
    const me_response = await GET_me(context);
    const data: ProxyUserResponse = await me_response.json()
    const avatar_response = await fetch(`https://${locals.runtime.env.SERVICENOW_INSTANCE}/${data.user_avatar.substring(0, data.user_avatar.indexOf(("?")))}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${locals.access_token}`,
        },
    });
    const avatar_data = await avatar_response.blob();
    return new Response(avatar_data, { status: 200, headers: { "Content-Type": "image/png" } });
};
