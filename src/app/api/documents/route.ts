import prisma from "@/prisma/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export async function GET() {
	const session = await getSession();

	try {
		const documents = await prisma.document.findMany({
			where: {
				user_id: session?.user.sub,
			},
		});
		const mappedDocuments = documents.map((document) => ({
			createdAt: document.created_at,
			userId: document.user_id,
			...document,
		}));

		return new NextResponse(JSON.stringify({ documents: mappedDocuments }), {
			status: 200,
		});
	} catch (e) {
		return new NextResponse(JSON.stringify(e), { status: 500 });
	}
}
