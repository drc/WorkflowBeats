import type { APIRoute } from "astro";
import { GET as GET_me } from "@/pages/api/user/me";

const ONE_DAY = 86400; // 1 day in seconds

// TODO: refactor like the other endpoints / error handling

export const GET: APIRoute = async (context) => {
    const { locals } = context;
    const me_response = await GET_me(context);
    if (me_response.status !== 200) {
        return new Response("Unauthorized", { status: 401 });
    }
    const data: ProxyUserResponse = await me_response.json();

    const cache = await context.locals.runtime.env.workflowbeats.get(`${data.user_sys_id}_avatar`, { type: "arrayBuffer", cacheTtl: ONE_DAY });

    // Return the cached image if it exists
    if (cache) {
        return new Response(cache, { status: 200, headers: { "Content-Type": "image/jpeg;charset=utf-8" } });
    }

    // Fetch the image from ServiceNow
    const avatar_response = await fetch(`https://${locals.runtime.env.SERVICENOW_INSTANCE}/${data.user_avatar.substring(0, data.user_avatar.indexOf(("?")))}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${locals.access_token}`,
        },
    });
    const avatar_data = await avatar_response.blob();
    const image_buffer = await avatar_data.arrayBuffer();
    await context.locals.runtime.env.workflowbeats.put(`${data.user_sys_id}_avatar`, image_buffer, { expirationTtl: ONE_DAY });
    return new Response(image_buffer, { status: 200, headers: { "Content-Type": "image/jpeg;charset=utf-8" } });
};
