import { GenerateUrlBody } from "@/data/types";

export const generateUploadUrls = (params: GenerateUrlBody) =>
	fetch("http://localhost:3000/api/upload", {
		method: "POST",
		body: JSON.stringify({ params }),
	});

export const uploadFiles = (url: string, file: File) =>
	fetch(url, {
		method: "PUT",
		body: new Blob([file]),
		headers: {
			"Content-Type": file.type,
		},
	});

export const createDocument = (fileName: string, userId: string) =>
	fetch("http://localhost:3000/api/document", {
		method: "POST",
		body: JSON.stringify({
			name: fileName,
			userId,
		}),
	});
