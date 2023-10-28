"use client";

import { Button, Form, Input } from "@/components";
import DateRangeSelector from "@/components/Forms/Inputs/DateRange";
import { Card, CardContent, CardHeader } from "@/components/ShadcnUi/card";
import { searchEventsFormSchema } from "@/data/formData";
import { SearchEventFormSchema, SearchEventsFormType } from "@/data/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import EventSearchInput from "../Inputs/EventSearchInput";
import { CategoryInput } from "../Inputs/CategoryInput";

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
					<div className="mb-2">
						<DateRangeSelector control={form.control} />
					</div>
					<div className="flex flex-wrap">
						<CategoryInput control={form.control} />
						<Button
							className="self-center ml-4"
							onClick={async () => {
								const formValues = form.getValues();
								console.log(formValues.dateRange);
								const params = composeSearchParams({
									dateRangeFrom: formValues.dateRange.from,
									dateRangeTo: formValues.dateRange.to,
									searchterm: formValues.searchTerm,
									category: formValues.category,
								});
								const res = await fetch(
									`http://localhost:3000/api/events${params}`
								);

								console.log(await res.json());
							}}
						>
							Search
						</Button>
					</div>
				</CardContent>
			</Form>
		</Card>
	);
};

function composeSearchParams(arg: {
	[key: string]: string | number | undefined | Date;
}) {
	const keysArray = Object.keys(arg);
	if (keysArray.length === 0) {
		return "";
	}
	return keysArray.reduce((acc, curr) => {
		console.log(acc, curr);
		if (arg[curr] !== undefined && arg[curr] !== "") {
			acc = `${acc}${acc === "" ? "" : "&"}${curr}=${arg[curr]}`;
			return acc;
		}
		return acc;
	}, "?");
}

export default SearchEventsForm;
