"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ShadcnUi/button";
import { Form } from "@/components/ShadcnUi/form";
import { createEventFormSchema } from "@/data/formData";
import { DocumentSelectorFormInput } from "../Inputs/DocumentSelectorInput";
import { EventDescriptionFormInput } from "../Inputs/EventDescriptionInput";
import { EventNameFormInput } from "../Inputs/EventNameInput";
import { CategoryInput } from "../Inputs/CategoryInput";
import { DatePickerFormInput } from "../Inputs/DatePicker";
import { CreateCategory } from "@/components";
import { createEvent } from "@/requests";
import { CreateEventForm } from "@/data/types";

const CreateEventForm = ({
	defaultValues,
}: {
	defaultValues: CreateEventForm;
}) => {
	const form = useForm<z.infer<typeof createEventFormSchema>>({
		resolver: zodResolver(createEventFormSchema),
		defaultValues: defaultValues,
	});

	return (
		<Form {...form}>
			<div className="col-span-3 p-10">
				<EventNameFormInput control={form.control} />
				<div className="flex">
					<CategoryInput control={form.control} />
					<CreateCategory />
				</div>
				<EventDescriptionFormInput control={form.control} />
				<DatePickerFormInput control={form.control} />
			</div>
			<div className="col-span-3 container mx-auto lg:py-10 pl-10">
				<DocumentSelectorFormInput control={form.control} />
			</div>
			<div className="col-span-3 pl-10 sm:mt-4 sm:mb-4">
				<Button
					onClick={async () => {
						createEvent(form.getValues());
					}}
					className="w-1/2"
				>
					Save
				</Button>
			</div>
		</Form>
	);
};

export default CreateEventForm;
