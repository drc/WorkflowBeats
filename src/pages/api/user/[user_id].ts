import type { APIRoute } from "astro";
import { z } from "zod";

export const GET: APIRoute = async ({ params, locals }) => {
	try {
		const id = z.string().regex(/^[a-zA-Z0-9]{32}$/, "Invalid user ID");
		const user_id = id.safeParse(params.user_id);
		if (!user_id.success) {
			throw new Error("Invalid user ID");
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
		if (!response.ok) {
			throw new Error("Resource unavailable");
		}
		const { result: data }: UserResponse = await response.json();

		return new Response(JSON.stringify(data), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.debug(error);
		return new Response(`Internal Server Error: ${error}`, { status: 500 });
	}
};
