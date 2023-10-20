import { createEventFormDefaultValues } from "@/data/formData";
import { redirect } from "next/navigation";
import CreateEventForm from "@/components/Forms/CreateEventForm/CreateEventForm";
import { getSession } from "@auth0/nextjs-auth0";

async function CreateEvent() {
	const session = await getSession();

	if (!session?.user) {
		redirect("/");
	}

	return (
		<div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-1 gap-3 lg:pl-12 md:pl-12 pl-8 lg:pr-12 md:pr-12 pr-8 pt-12">
			<CreateEventForm defaultValues={createEventFormDefaultValues} />
		</div>
	);
}

export default CreateEvent;
