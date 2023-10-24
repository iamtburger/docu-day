import prisma from "@/prisma/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export async function GET() {
	const session = await getSession();

	try {
		const events = await prisma.event.findMany({
			where: {
				user_id: session?.user.sub,
			},
		});
		const categories = await prisma.category.findMany({});

		const mappedEvents = events.map((event) => {
			return {
				id: event.id,
				name: event.name,
				eventDate: event.event_date,
				description: event.description,
				category: (categories ?? []).find(
					(category) => event.category_id === category.id
				)?.name,
			};
		});

		return new NextResponse(JSON.stringify({ data: mappedEvents }), {
			status: 200,
		});
	} catch (e) {
		console.error("Something went wront while fetching events", e);
		return new NextResponse(JSON.stringify(e), { status: 500 });
	}
}
