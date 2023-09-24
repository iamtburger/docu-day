import prisma from "@/prisma/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { name, userId } = body;

	try {
		const uploadedDocument = await prisma.document.create({
			data: {
				name,
				user_id: userId,
			},
		});
		console.log(uploadedDocument);

		return new Response(JSON.stringify("YEAH"));
	} catch (e) {
		console.error(e);
	}
}
