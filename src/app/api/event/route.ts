import { EventFormSchema } from "@/data/types";
import prisma from "@/prisma/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

type EventFormBody = EventFormSchema & { createdAt: Date };

export async function POST(req: NextRequest) {
	const session = await getSession();

	if (!session?.user) {
		return new NextResponse(JSON.stringify("User not authenticated!"), {
			status: 401,
		});
	}

	try {
		const body: EventFormBody = await req.json();
		const { documents, name, description, eventDate, createdAt } = body;

		const newEvent = await prisma.event.create({
			data: {
				name: name,
				description: description,
				event_date: eventDate,
				user_id: session.user.sub,
				created_at: createdAt,
				category_id: Number(body.category),
				documents: {
					create: documents.map((document: any) => {
						return {
							assigned_at: new Date(),
							document: {
								connectOrCreate: {
									where: { id: document.id },
									create: {
										name: document.name,
										user_id: session.user.sub,
									},
								},
							},
						};
					}),
				},
			},
		});
		return new NextResponse(JSON.stringify(newEvent));
	} catch (e) {
		console.error("Event creation error!", e);
		return new NextResponse(JSON.stringify(e), { status: 500 });
	}
}

// export async function GET(req: NextRequest) {
// 	const session = await getSession();

// 	const body = req.nextUrl.searchParams;
// 	const eventId = body.get("eventId");

// 	if (!eventId) {
// 		return new NextResponse(JSON.stringify("Missing event id"), {
// 			status: 400,
// 		});
// 	}

// 	try {
// 		const event = prisma.event.findFirst({
// 			where: {
// 				user_id: session?.user.sub,
// 				id: Number(eventId),
// 			},
// 		});
// 		return new NextResponse(JSON.stringify(event), { status: 200 });
// 	} catch (e) {
// 		console.log(e);
// 		return new NextResponse(JSON.stringify(e), { status: 500 });
// 	}
// }
