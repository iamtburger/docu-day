import { EventFormSchema, GenerateUrlBody } from "@/data/types";
import { apiEndpoints } from "./urls";

export const generateUploadUrls = (params: GenerateUrlBody) =>
	fetch(apiEndpoints.GENERATE_URL, {
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
	fetch(apiEndpoints.DOCUMENT, {
		method: "POST",
		body: JSON.stringify({
			name: fileName,
			userId,
		}),
	});

export const fetchDocuments = () => fetch(apiEndpoints.DOCUMENTS);

// TODO: add support for creating multiple categories
export const createCategory = (category: string) => {
	fetch(apiEndpoints.CATEGORIES, {
		method: "POST",
		body: JSON.stringify({ name: category }),
	});
};

export const fetchDocumentDownloadUrl = (fileName: string) =>
	fetch(`${apiEndpoints.DOCUMENT}?file=${fileName}`);

export const createEvent = (formData: EventFormSchema) =>
	fetch(apiEndpoints.EVENT, {
		method: "POST",
		body: JSON.stringify(formData),
	});

export const fetchCategories = () => fetch(apiEndpoints.CATEGORIES);
