"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader } from "@/components/ShadcnUi/card";

import { Button, Form } from "@/components";
import DateRangeSelector from "@/components/Forms/Inputs/DateRange";
import EventSearchInput from "../Inputs/EventSearchInput";
import { CategoryInput } from "../Inputs/CategoryInput";
import { searchEventsFormSchema } from "@/data/formData";
import { SearchEventFormSchema, SearchEventsFormType } from "@/data/types";
import {
	eventName,
	eventDate,
	// openEvent,
	composeOpenEventColumn,
} from "@/components/DocumentSelectorTable/columnDefinitions";
import { fetchEvents } from "@/requests/requests";
import DataTable from "@/components/DataTable/DataTable";

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
	const [events, setEvents] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const getSearchParams = useCallback(async () => {
		const formValues = form.getValues();
		const params = composeSearchParams(
			{
				dateRangeFrom: formValues.dateRange.from,
				dateRangeTo: formValues.dateRange.to,
				searchTerm: formValues.searchTerm,
				category: formValues.category,
			},
			searchEventFormEmptyValues
		);
		setSearchParams(params);
	}, [form]);

	const searchEvents = useCallback(() => {
		setIsLoading(true);
		fetchEvents(searchParams).then(async (res) => {
			const { data } = await res.json();
			setEvents(data);
			setIsLoading(false);
		});
	}, [searchParams]);

	useEffect(() => {
		searchEvents();
	}, [searchEvents]);

	const openEvent = composeOpenEventColumn(searchEvents);

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
				<DataTable
					columns={[eventName, eventDate, openEvent]}
					data={events}
					isLoading={isLoading}
				/>
			</div>
		</>
	);
};

function composeSearchParams(
	arg: {
		[key: string]: string | number | undefined | Date;
	},
	emptyValues: { [key: string]: string | undefined }
) {
	const keysArray = Object.keys(arg);
	if (keysArray.length === 0) {
		return "";
	}
	return keysArray.reduce((acc, curr) => {
		if (emptyValues[curr] !== arg[curr]) {
			acc = `${acc}${acc === "?" ? "" : "&"}${curr}=${arg[curr]}`;
			return acc;
		}
		return acc;
	}, "?");
}

const searchEventFormEmptyValues: Record<string, string | undefined> = {
	searchTerm: "",
	dateRangeFrom: undefined,
	dateRangeTo: undefined,
	category: "",
};

export default SearchEventsForm;
