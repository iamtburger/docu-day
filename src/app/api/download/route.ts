import {
	S3Client,
	PutObjectCommand,
	ListObjectsV2Command,
	GetObjectCommand,
} from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";

const URL = "https://f348048b6e0e8a16959deee89839e04f.r2.cloudflarestorage.com";

// token value: kQHnkSZ4OOKX5CyrETZgTgSrNz-cVYDMFGND1Hw7
// access key id: a03980bc5bad53bda31524dbf283ea42
// secret access key: 7f133dcf2abe077f18d42ab88e9217e28fab95043af69f3449b8e4d955e00a62

const s3 = new S3Client({
	endpoint: URL,
	region: "auto",
	credentials: {
		accessKeyId: "a03980bc5bad53bda31524dbf283ea42",
		secretAccessKey:
			"7f133dcf2abe077f18d42ab88e9217e28fab95043af69f3449b8e4d955e00a62",
	},
});

export async function GET(req: NextRequest) {
	const dl = new GetObjectCommand({ Bucket: "docs", Key: "new_file.txt" });

	try {
		const response = await s3.send(dl);
		console.log(await response.Body?.transformToString());
	} catch (e) {
		console.log(e);
	}

	//const response = await s3.send(new ListObjectsV2Command({ Bucket: "docs" }));

	return new Response("OK", {
		status: 200,
	});
}