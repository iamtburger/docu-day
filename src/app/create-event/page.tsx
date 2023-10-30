import { createEventFormDefaultValues } from "@/data/formData";
import CreateEventForm from "@/components/Forms/CreateEventForm/CreateEventForm";

async function CreateEvent() {
	return (
		<div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-1 gap-3 lg:pl-12 md:pl-12 pl-8 lg:pr-12 md:pr-12 pr-8 pt-12">
			<CreateEventForm defaultValues={createEventFormDefaultValues} />
		</div>
	);
}

export default CreateEvent;
