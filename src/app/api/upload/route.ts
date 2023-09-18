import {
	S3Client,
	PutObjectCommand,
	ListObjectsV2Command,
	PutObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";
import { s3 } from "@/app/s3Client/s3Client";

const uploadFiles = async (
	fileName: string,
	contentType: string,
	body: Buffer
) => {
	const command = new PutObjectCommand({
		Bucket: `docs`,
		Key: fileName,
		Body: body,
		ContentType: contentType,
	});
	try {
		const response = await s3.send(command);
		return { ...response, fileName };
	} catch (e) {
		console.error(e);
		// return { fileName };
	}
};

interface FileUploadResponse extends PutObjectCommandOutput {
	fileName: string;
}

export async function POST(req: NextRequest) {
	const files = (await req.formData()).values();
	const fileUploadStatuses: Promise<FileUploadResponse | undefined>[] = [];

	for (let file of files) {
		// Alternatively you can generate multiple signedUrl-s send them back to the browser
		// and start the upload from the client using these urls separately
		if (file instanceof Blob) {
			const content = Buffer.from(await file.arrayBuffer());
			const result = uploadFiles(file.name, file.type, content);
			fileUploadStatuses.push(result);
		} else {
			// What to do in this case?
		}
	}
	//const response = await s3.send(new ListObjectsV2Command({ Bucket: "docs" }));

	const response = await Promise.allSettled(fileUploadStatuses);

	return new Response(JSON.stringify(response), {
		status: 200,
	});
}
