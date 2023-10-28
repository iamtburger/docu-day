"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader } from "@/components/ShadcnUi/card";

import { Button, DocumentsSelectorTable, Form } from "@/components";
import DateRangeSelector from "@/components/Forms/Inputs/DateRange";
import EventSearchInput from "../Inputs/EventSearchInput";
import { CategoryInput } from "../Inputs/CategoryInput";
import { searchEventsFormSchema } from "@/data/formData";
import { SearchEventFormSchema, SearchEventsFormType } from "@/data/types";
import {
	eventName,
	eventDate,
	openEvent,
} from "@/components/DocumentSelectorTable/columnDefinitions";
import { fetchEvents } from "@/requests/requests";

const SearchEventsForm = ({
	defaultValues,
}: {
	defaultValues: SearchEventsFormType;
}) => {
	const form = useForm<SearchEventFormSchema>({
		resolver: zodResolver(searchEventsFormSchema),
		defaultValues: defaultValues,
	});

	const [searchParams, setSearchParams] = useState("");

	const getSearchParams = useCallback(async () => {
		const formValues = form.getValues();
		const params = composeSearchParams({
			dateRangeFrom: formValues.dateRange.from,
			dateRangeTo: formValues.dateRange.to,
			searchterm: formValues.searchTerm,
			category: formValues.category,
		});
		setSearchParams(params);
	}, [form]);

	// FIXME: this is a workaround, until abstracting the base datatable not working. So probably forever
	const searchEvents = useCallback(
		() => fetchEvents(searchParams),
		[searchParams]
	);

	return (
		<>
			<div className="lg:col-span-2 col-span-6 p-4">
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
								<Button className="self-center ml-4" onClick={getSearchParams}>
									Search
								</Button>
							</div>
						</CardContent>
					</Form>
				</Card>
			</div>
			<div className="lg:col-span-4 col-span-6 m-4">
				<DocumentsSelectorTable
					columns={[eventName, eventDate, openEvent]}
					fetchData={searchEvents}
				/>
			</div>
		</>
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
		if (arg[curr] !== undefined && arg[curr] !== "") {
			acc = `${acc}${acc === "?" ? "" : "&"}${curr}=${arg[curr]}`;
			return acc;
		}
		return acc;
	}, "?");
}

export default SearchEventsForm;
