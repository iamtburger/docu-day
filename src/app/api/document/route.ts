import prisma from "@/prisma/prisma";
import { s3 } from "@/s3Client/s3Client";
import { getSession } from "@auth0/nextjs-auth0";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

export async function GET(req: NextRequest) {
	const session = await getSession();

	if (!session?.user) {
		return new NextResponse(JSON.stringify("User not authenticated!"), {
			status: 401,
		});
	}

	try {
		const bucketName = session.user.sub.replace("|", "-");
		const fileName = req.nextUrl.searchParams.get("file");

		if (bucketName && fileName) {
			const dl = new GetObjectCommand({
				Bucket: "docs",
				Key: decodeURIComponent(fileName),
			});
			const fileBody = await getSignedUrl(s3, dl, { expiresIn: 25000 });
			return new NextResponse(JSON.stringify({ fileBody }));
			// const response = await s3.send(dl);
			// console.log(response);
			// const fileBody = await response.Body?.transformToString();
			// return new NextResponse(JSON.stringify({ fileBody }));
		}
	} catch (e) {
		return new NextResponse(JSON.stringify(e));
	}
}
