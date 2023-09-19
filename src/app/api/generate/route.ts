import { NextRequest } from "next/server";
import {
	S3Client,
	PutObjectCommand,
	ListObjectsV2Command,
	GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/app/s3Client/s3Client";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const urls = await Promise.all(
		body.params.map(async (param: any) => {
			try {
				const url = await getSignedUrl(
					s3,
					new PutObjectCommand({ Bucket: param.bucketName, Key: param.key }),
					{ expiresIn: 5500 }
				);
				return {
					key: param.key,
					url,
				};
			} catch (e) {
				return {
					// do something with this case
					key: param.key,
					message: `Failed to generate upload url for ${param.key} in ${param.bucketName}`,
				};
			}
		})
	);

	return new Response(JSON.stringify({ urls }), {
		status: 200,
	});
}
