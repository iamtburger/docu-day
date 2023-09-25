import { z } from "zod";

export const createEventFormSchema = z.object({
	username: z.string().min(2).max(40),
	name: z.string().min(3).max(100),
	description: z.string().max(500).optional(),
	eventDate: z.date(),
	uploadDate: z.date(),
	documents: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			createdAt: z.date(),
			userId: z.string(),
		})
	),
	category: z.string(),
});

export const createEventFormDefaultValues = (id?: string | null) => ({
	username: id || "",
	name: "",
	description: "",
	eventDate: new Date(),
	uploadDate: new Date(),
	documents: [],
	category: "",
});
