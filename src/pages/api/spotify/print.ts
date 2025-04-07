import { playlist } from "@/db/schema";
import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";

export const POST: APIRoute = async (context) => {
	try {
		const db = drizzle(context.locals.runtime.env.DB, {
			schema: { playlist },
		});
		const { request } = context;
		// get the request body
		const body = await request.json();
		console.log({ body });
		// send to printer
		const printer_response = await fetch(
			"https://pryntyr.dancigrang.dev/api/spotify",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			},
		);
		if (!printer_response.ok) {
			throw new Error("Printer error");
		}
		const playlist_record = await db
			.insert(playlist)
			.values({
				song_data: JSON.stringify(body),
				user: context.locals.user_data.id,
			})
			.returning();
		console.log({ playlist_record });
		// not implemented
		return new Response(null, { status: 201 });
	} catch (error) {
		return new Response(`${error}`, { status: 500 });
	}
};
