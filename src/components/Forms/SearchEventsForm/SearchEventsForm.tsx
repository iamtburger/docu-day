"use client";

import { Input } from "@/components";
import DateRangeSelector from "@/components/DateRangeSelector";
import { Card, CardContent, CardHeader } from "@/components/ShadcnUi/card";
import { searchEventsFormSchema } from "@/data/formData";
import {
	SearchEventFormSchema,
	SearchEventsFormControl,
	SearchEventsFormType,
} from "@/data/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { useForm } from "react-hook-form";

// Default date range (current month)
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
			<CardHeader>Search events</CardHeader>
			<CardContent>
				<p className="text-xs">Search by name or description</p>
				<Input className="mb-2" placeholder="Robocop" />
				<p className="text-xs">Event date range</p>
				<DateRangeSelector
					className="mb-2"
					control={form.control as SearchEventsFormControl}
				/>
				<p className="text-xs">Category</p>
			</CardContent>
		</Card>
	);
};

export default SearchEventsForm;
