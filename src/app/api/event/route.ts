import prisma from "@/prisma/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { documents } = body;

	const newEvent = await prisma.event.create({
		data: {
			name: body.name,
			description: body.description,
			event_date: body.eventDate,
			user_id: body.username,
			created_at: body.createdAt,
			// category_id: body.category,
			category_id: 32,
			documents: {
				create: documents.map((document: any) => {
					return {
						assigned_at: new Date(),
						document: {
							connectOrCreate: {
								where: { id: document.id },
								create: {
									name: document.name,
									user_id: body.username,
								},
							},
						},
					};
				}),
			},
			// documents: {
			// 	create: [
			// 		{
			// 			// other EventDocuments fields...
			// 			assigned_at: new Date(),
			// 			document: {
			// 				connectOrCreate: {
			// 					where: { id: 12 }, // replace with your Document id
			// 					create: {
			// 						name: "Document Name",
			// 						user_id: body.username,
			// 					},
			// 				},
			// 			},
			// 		},
			// 	],
			// },
		},
	});

	console.log(newEvent);

	return new Response(JSON.stringify("YEAH"));
}
