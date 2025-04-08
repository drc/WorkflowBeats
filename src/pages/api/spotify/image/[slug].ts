import type { APIRoute } from "astro";
import { z } from "zod";

const TWO_MINUTES = 120; // 5 minutes in seconds

export const GET: APIRoute = async ({ params, locals }) => {
	try {
		const id = z.string().regex(/^[a-zA-Z0-9]{40}$/, "Invalid image ID");
		const slug = id.safeParse(params.slug);
		if (!slug.success) {
			throw new Error(slug.error.message);
		}

		const cache = await locals.runtime.env.workflowbeats.get(slug.data, {
			type: "arrayBuffer",
			cacheTtl: TWO_MINUTES,
		});

		// Return the cached image if it exists
		if (cache) {
			return new Response(cache, {
				status: 200,
				headers: {
					"Content-Type": "image/jpeg;charset=utf-8",
					"Cache-Control": `private, max-age=${TWO_MINUTES}, must-revalidate`,
				},
			});
		}

		// Fetch the image from ServiceNow
		const album_response = await fetch(`https://i.scdn.co/image/${slug.data}`, {
			method: "GET",
		});
		const album_image_data = await album_response.blob();
		const image_buffer = await album_image_data.arrayBuffer();
		await locals.runtime.env.workflowbeats.put(slug.data, image_buffer, {
			expirationTtl: TWO_MINUTES,
		});
		return new Response(image_buffer, {
			status: 200,
			headers: { "Content-Type": "image/jpeg;charset=utf-8" },
		});
	} catch (error) {
		console.debug(error);
		return new Response(`Internal server error: ${error}`, {
			status: 500,
		});
	}
};
