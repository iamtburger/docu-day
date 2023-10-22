import { z } from "zod";
import { RequestState } from "./enums";
import { createEventFormSchema, searchEventsFormSchema } from "./formData";
import { Control } from "react-hook-form";
import { DateRange } from "react-day-picker";

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

export type EventFormSchema = z.infer<typeof createEventFormSchema>;
export type SearchEventFormSchema = z.infer<typeof searchEventsFormSchema>;
export type CreateEventFormControl = Control<EventFormSchema>;
export type SearchEventsFormControl = Control<SearchEventFormSchema>;

interface Document {
	id: number;
	name: string;
	createdAt: Date;
	userId: string;
}

export type EventDocument = {
	id: number;
	name: string;
	createdAt: Date;
	downloadUrl?: string;
};

export interface CreateEventForm {
	name: string;
	description: string;
	eventDate: Date;
	uploadDate: Date;
	documents: EventDocument[];
	category: string;
}

export interface SearchEventsFormType {
	searchTerm?: string;
	dateRange: DateRange;
	category?: string;
}
