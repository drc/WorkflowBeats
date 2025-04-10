import { playlist } from "@/db/schema";
import type { APIRoute } from "astro";
import db from "@/db";

export const POST: APIRoute = async (context) => {
	try {
		const sqlite = db(context.locals.runtime.env.DB);
		const { request } = context;
		// get the request body
		const body = await request.json();
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
		await sqlite.insert(playlist).values({
			song_data: JSON.stringify(body),
			user: context.locals.user_data.id,
		});
		// not implemented
		return new Response(null, { status: 201 });
	} catch (error) {
		return new Response(`${error}`, { status: 500 });
	}
};
