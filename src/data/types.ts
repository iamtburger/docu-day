import { RequestState } from "./enums";

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
