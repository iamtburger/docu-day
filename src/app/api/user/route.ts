import prisma from "@/prisma/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();

	try {
		const newUser = await prisma.user.create({
			data: {
				id: body.id,
				username: body.username,
			},
		});
		return new Response(JSON.stringify(newUser), { status: 201 });
	} catch (e) {
		return new Response(JSON.stringify(e), { status: 500 });
	}
}
