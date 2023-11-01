import prisma from "@/prisma/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const session = await getSession();

	const body = req.nextUrl.searchParams;
	const eventId = body.get("eventId");

	let filter = {};

	if (eventId) {
		filter = {
			events: {
				some: {
					event_id: Number(eventId),
				},
			},
		};
	}

	try {
		const documents = await prisma.document.findMany({
			where: {
				user_id: session?.user.sub,
				...filter,
			},
		});
		const mappedDocuments = documents.map((document) => ({
			createdAt: document.created_at,
			userId: document.user_id,
			...document,
		}));

		return new NextResponse(JSON.stringify({ data: mappedDocuments }), {
			status: 200,
		});
	} catch (e) {
		console.log(e);
		return new NextResponse(JSON.stringify(e), { status: 500 });
	}
}
