"use client";

import { Form, Input } from "@/components";
import DateRangeSelector from "@/components/Forms/Inputs/DateRange";
import { Card, CardContent, CardHeader } from "@/components/ShadcnUi/card";
import { searchEventsFormSchema } from "@/data/formData";
import { SearchEventFormSchema, SearchEventsFormType } from "@/data/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import EventSearchInput from "../Inputs/EventSearchInput";

// No result -> No events found between XXXX - YYYY

const SearchEventsForm = ({
	defaultValues,
}: {
	defaultValues: SearchEventsFormType;
}) => {
	const form = useForm<SearchEventFormSchema>({
		resolver: zodResolver(searchEventsFormSchema),
		defaultValues: defaultValues,
	});

	return (
		<Card>
			<Form {...form}>
				<CardHeader>Search events</CardHeader>
				<CardContent>
					<div className="mb-2">
						<EventSearchInput control={form.control} />
					</div>
					<DateRangeSelector control={form.control} />
					<p className="text-xs">Category</p>
				</CardContent>
			</Form>
		</Card>
	);
};

export default SearchEventsForm;
