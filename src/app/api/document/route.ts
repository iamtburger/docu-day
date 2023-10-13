import prisma from "@/prisma/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

import { s3 } from "@/s3Client/s3Client";
import { getFolderName } from "@/utils/utils";

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

export async function GET(req: NextRequest) {
	const session = await getSession();

	if (!session?.user) {
		return new NextResponse(JSON.stringify("User not authenticated!"), {
			status: 401,
		});
	}

	try {
		const folderName = getFolderName(session.user.sub);
		const fileName = req.nextUrl.searchParams.get("file");

		if (folderName && fileName) {
			const dl = new GetObjectCommand({
				Bucket: "docs",
				Key: `${folderName}/${decodeURIComponent(fileName)}`,
			});
			const downloadUrl = await getSignedUrl(s3, dl, { expiresIn: 25000 });
			return new NextResponse(JSON.stringify({ downloadUrl }));
		}
	} catch (e) {
		return new NextResponse(JSON.stringify(e));
	}
}
