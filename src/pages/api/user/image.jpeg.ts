import type { APIRoute } from "astro";

const ONE_DAY = 86400; // 1 day in seconds

export const GET: APIRoute = async (context) => {
	const { locals } = context;
	const { user_data } = locals;
	if (!user_data) {
		return new Response("Unauthorized", { status: 401 });
	}

	const cache = await context.locals.runtime.env.workflowbeats.get(
		`${user_data.sys_id}_avatar`,
		{ type: "arrayBuffer", cacheTtl: ONE_DAY },
	);

	// Return the cached image if it exists
	if (cache) {
		return new Response(cache, {
			status: 200,
			headers: {
				"Content-Type": "image/jpeg;charset=utf-8",
				"Cache-Control": `private, max-age=${ONE_DAY}, must-revalidate`,
			},
		});
	}

	// Check if the avatar URL is valid
	if (!user_data.avatar_url) {
		return new Response("No avatar URL", { status: 404 });
	}

	// Fetch the image from ServiceNow
	const avatar_response = await fetch(
		`https://${locals.runtime.env.SERVICENOW_INSTANCE}/${user_data.avatar_url.substring(0, user_data.avatar_url?.indexOf("?"))}`,
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${locals.access_token}`,
			},
		},
	);
	const avatar_data = await avatar_response.blob();
	const image_buffer = await avatar_data.arrayBuffer();
	await context.locals.runtime.env.workflowbeats.put(
		`${user_data.sys_id}_avatar`,
		image_buffer,
		{ expirationTtl: ONE_DAY },
	);
	return new Response(image_buffer, {
		status: 200,
		headers: { "Content-Type": "image/jpeg;charset=utf-8" },
	});
};
