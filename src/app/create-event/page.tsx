"use client";

import { useEffect } from "react";
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

function CreateEvent() {
	const { user } = useUser();

	const form = useForm<z.infer<typeof createEventFormSchema>>({
		resolver: zodResolver(createEventFormSchema),
		defaultValues: createEventFormDefaultValues(user?.sub),
	});

	useEffect(() => {
		if (user?.sub !== null && user?.sub !== undefined) {
			form.setValue("username", user?.sub);
		}
	}, [user, form]);

	return (
		<div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-1 gap-3 lg:pl-12 md:pl-12 pl-8 lg:pr-12 md:pr-12 pr-8 pt-12">
			<Form {...form}>
				<div className="col-span-3 p-10">
					<EventNameFormInput control={form.control} />
					<div className="flex">
						<CategoryInput control={form.control} categories={languages} />
						<CreateCategory />
					</div>
					<EventDescriptionFormInput control={form.control} />
					<DatePickerFormInput control={form.control} />
				</div>
				<div className="col-span-3 container mx-auto lg:py-10">
					<DocumentSelectorFormInput control={form.control} />
				</div>
				<div className="col-span-3 pl-10">
					<Button
						onClick={async () => {
							fetch("http://localhost:3000/api/event", {
								method: "POST",
								body: JSON.stringify(form.getValues()),
							});
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

const languages = [
	{ label: "English", value: "en" },
	{ label: "French", value: "fr" },
	{ label: "German", value: "de" },
	{ label: "Spanish", value: "es" },
	{ label: "Portuguese", value: "pt" },
	{ label: "Russian", value: "ru" },
	{ label: "Japanese", value: "ja" },
	{ label: "Korean", value: "ko" },
	{ label: "Chinese", value: "zh" },
];

export default CreateEvent;
