import prisma from "@/prisma/prisma";
import { s3 } from "@/s3Client/s3Client";
import { getBucketName } from "@/utils/utils";
import { CreateBucketCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const bucketName = getBucketName(body.id);
	const createBucketCommand = new CreateBucketCommand({
		Bucket: bucketName,
	});

	try {
		const newUser = await prisma.user.create({
			data: {
				id: body.id,
				username: body.username,
			},
		});
		await s3.send(createBucketCommand);
		return new NextResponse(JSON.stringify(newUser), { status: 201 });
	} catch (e) {
		return new Response(JSON.stringify(e), { status: 500 });
	}
}
