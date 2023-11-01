import { createEventFormDefaultValues } from "@/data/formData";
import { EditEventForm } from "@/components/Forms/EventForm/EventForm";
import { editEvent } from "@/requests/requests";
import prisma from "@/prisma/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { mapEventsWithCategories } from "@/utils/utils";

// Server action to get the data from database?

async function CreateEvent(props: any) {
	const session = await getSession();
	const { params }: { params: { id: string } } = props;

	const event = await prisma.event.findUnique({
		where: { user_id: session?.user.sub, id: Number(params.id) },
	});

	const documents = await prisma.document.findMany({
		where: {
			user_id: session?.user.sub,
			events: {
				some: {
					event_id: Number(params.id),
				},
			},
		},
	});

	const mappedDocuments = documents.map((document) => ({
		createdAt: document.created_at,
		userId: document.user_id,
		...document,
	}));

	if (event) {
		const defaultValues = {
			id: event?.id,
			name: event?.name,
			eventDate: event?.event_date,
			description: event?.description || "",
			category: String(event?.category_id),
			uploadDate: event?.created_at,
			documents: mappedDocuments || [],
		};

		return (
			<div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-1 gap-3 lg:pl-12 md:pl-12 pl-8 lg:pr-12 md:pr-12 pr-8 pt-12">
				<EditEventForm defaultValues={defaultValues} />
			</div>
		);
	}
}

export default CreateEvent;
