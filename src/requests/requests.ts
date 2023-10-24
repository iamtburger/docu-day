import { EventFormSchema, GenerateUrlBody } from "@/data/types";
import { ApiEndpoints } from "./urls";

export const generateUploadUrls = (params: GenerateUrlBody) =>
	fetch(ApiEndpoints.GENERATE_URL, {
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
	fetch(ApiEndpoints.DOCUMENT, {
		method: "POST",
		body: JSON.stringify({
			name: fileName,
			userId,
		}),
	});

export const fetchDocuments = () => fetch(ApiEndpoints.DOCUMENTS);

// TODO: add support for creating multiple categories
export const createCategory = (category: string) =>
	fetch(ApiEndpoints.CATEGORIES, {
		method: "POST",
		body: JSON.stringify({ name: category }),
	});

export const fetchDocumentDownloadUrl = (fileName: string) =>
	fetch(`${ApiEndpoints.DOCUMENT}?file=${fileName}`);

export const createEvent = (formData: EventFormSchema) =>
	fetch(ApiEndpoints.EVENT, {
		method: "POST",
		body: JSON.stringify(formData),
	});

export const fetchCategories = () => fetch(ApiEndpoints.CATEGORIES);

export const fetchEvents = () => fetch(ApiEndpoints.EVENTS);
