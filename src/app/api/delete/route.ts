import prisma from "@/prisma/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
	try {
		const session = await getSession();
		const searchParams = req.nextUrl.searchParams;
		const id = searchParams.get("id");

		const result = await prisma.event.delete({
			where: {
				user_id: session?.user.sub,
				id: Number(id),
			},
		});

		return new NextResponse(JSON.stringify({ result }), {
			status: 200,
		});
	} catch (e) {
		console.error("Something went wront while deleteting event", e);
		return new NextResponse(
			JSON.stringify({
				result: {
					error: e,
					message: "Something went wrong while trying to delete event",
				},
			}),
			{ status: 500 }
		);
	}
}
