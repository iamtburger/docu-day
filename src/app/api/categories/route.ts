import prisma from "@/prisma/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const session = await getSession();

	if (!session?.user) {
		return new NextResponse(JSON.stringify("User not authenticated!"), {
			status: 401,
		});
	}

	try {
		const { name } = await req.json();

		const newCategory = await prisma.user.update({
			where: {
				id: session.user.sub,
			},
			data: {
				categories: {
					connectOrCreate: {
						where: { name: name.toLowerCase() },
						create: { name: name.toLowerCase() },
					},
				},
			},
		});

		return new NextResponse(JSON.stringify(newCategory));
	} catch (e) {
		console.error("Category creation error!", e);
		return new NextResponse(JSON.stringify(e), { status: 500 });
	}
}

export async function GET() {
	const session = await getSession();
	const user = await prisma.user.findUnique({
		where: { id: session?.user.sub },
		include: { categories: true },
	});

	return new NextResponse(JSON.stringify(user?.categories));
}
