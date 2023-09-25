import { z } from "zod";
import { RequestState } from "./enums";
import { createEventFormSchema } from "./formData";

export type GenerateUrlBody = {
	bucketName: string;
	key: string;
	fileType: string;
}[];

export interface FileWithStatus {
	file: File;
	key: string;
	type: string;
	fileName: string;
	status?: RequestState;
	fileUploadUrl?: string;
}

export type DocumentSelectorFormSchema = z.infer<typeof createEventFormSchema>;

interface Document {
	id: number;
	name: string;
	createdAt: Date;
	userId: string;
}
