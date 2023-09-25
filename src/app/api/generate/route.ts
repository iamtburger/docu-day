import { NextRequest } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/s3Client/s3Client";
import { getSession } from "@auth0/nextjs-auth0";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const session = await getSession();
	const isUserAvailable =
		Boolean(session) && session?.user !== null && session?.user !== undefined;
	const urls = await Promise.all(
		body.params.map(async (param: any) => {
			try {
				if (!isUserAvailable) {
					throw new Error("User not available");
				} else {
					const url = await getSignedUrl(
						s3,
						new PutObjectCommand({ Bucket: session?.user.sub, Key: param.key }),
						{ expiresIn: 5500 }
					);
					return {
						key: param.key,
						url,
					};
				}
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
