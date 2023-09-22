import prisma from "@/prisma/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();
	console.log(body);

	const newEvent = await prisma.event.create({
		data: {
			name: body.name,
			description: body.description,
			event_date: body.eventDate,
			user_id: body.username,
			created_at: body.timestamp,
		},
	});

	console.log(newEvent);

	return new Response(JSON.stringify("YEAH"));
}
