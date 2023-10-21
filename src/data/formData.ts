import { format } from "date-fns";
import { z } from "zod";

export const createEventFormSchema = z.object({
	name: z.string().min(3).max(100),
	description: z.string().max(500).optional(),
	eventDate: z.date(),
	uploadDate: z.date(),
	documents: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			createdAt: z.date(),
		})
	),
	category: z.string(),
});

export const createEventFormDefaultValues = {
	name: "",
	description: "",
	eventDate: new Date(),
	uploadDate: new Date(),
	documents: [],
	category: "",
};

export const searchEventsFormSchema = z.object({
	searchTerm: z.string().optional(),
	dateRange: z.object({
		from: z.date(),
		to: z.date().optional(),
	}),
	category: z.string().optional(),
});

const defaultDateRange = {
	from: new Date(format(new Date(), "yyyy-MM-01")),
	to: new Date(),
};

export const searchEventsDefaultValues = {
	searchTerm: "",
	dateRange: defaultDateRange,
	category: "",
};
