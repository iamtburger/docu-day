"use client";

import { useForm } from "react-hook-form";
import { useUser } from "@auth0/nextjs-auth0/client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { CategoryInput } from "@/components/FormInputs/CategoryInput";
import { DatePickerFormInput } from "@/components/FormInputs/DatePicker";
import { Button } from "@/components/ShadcnUi/button";
import { Form } from "@/components/ShadcnUi/form";
import {
	createEventFormDefaultValues,
	createEventFormSchema,
} from "@/data/formData";
import {
	DocumentSelectorFormInput,
	EventDescriptionFormInput,
	EventNameFormInput,
} from "@/components/FormInputs";
import { CreateCategory } from "@/components";
import { redirect } from "next/navigation";
import { createEvent } from "@/requests";

function CreateEvent() {
	const { user, isLoading, error } = useUser();
	const form = useForm<z.infer<typeof createEventFormSchema>>({
		resolver: zodResolver(createEventFormSchema),
		defaultValues: createEventFormDefaultValues,
	});

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error</div>;

	if (!user) {
		redirect("/");
	}

	return (
		<div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-1 gap-3 lg:pl-12 md:pl-12 pl-8 lg:pr-12 md:pr-12 pr-8 pt-12">
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
		</div>
	);
}

export default CreateEvent;
