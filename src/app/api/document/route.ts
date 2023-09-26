import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

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
		return new NextResponse(JSON.stringify(uploadedDocument), { status: 201 });
	} catch (e) {
		console.error(e);
		return new NextResponse(JSON.stringify("Error while uploading document!"));
	}
}
