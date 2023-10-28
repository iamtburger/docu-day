import prisma from "@/prisma/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const session = await getSession();

	const searchParams = req.nextUrl.searchParams;
	const dateRangeFrom = searchParams.get("dateRangeFrom");
	const dateRangeTo = searchParams.get("dateRangeTo");
	const searchTerm = searchParams.get("searchTerm");
	const category = searchParams.get("category");

	let search = {};

	if (dateRangeFrom && dateRangeTo) {
		search = {
			...search,
			event_date: {
				lte: new Date(dateRangeFrom).toISOString(),
				gte: new Date(dateRangeTo).toISOString(),
			},
		};
	}

	if (searchTerm) {
		search = {
			...search,
			OR: [
				{
					name: { contains: searchTerm },
				},
				{
					description: { contains: searchTerm },
				},
			],
		};
	}

	if (category) {
		search = {
			...search,
			category_id: Number(category),
		};
	}

	try {
		const events = await prisma.event.findMany({
			where: {
				user_id: session?.user.sub,
				...search,
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
