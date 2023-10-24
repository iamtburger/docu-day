"use client";

import { DocumentsSelectorTable } from "@/components";
import {
	createdAt,
	fileName,
	download,
	openEvent,
	eventName,
	eventDate,
} from "@/components/DocumentSelectorTable/columnDefinitions";
import SearchEventsForm from "@/components/Forms/SearchEventsForm/SearchEventsForm";
import { searchEventsDefaultValues } from "@/data/formData";
import { fetchEvents } from "@/requests/requests";
import { NextPage } from "next";

const Dashboard: NextPage = () => {
	return (
		<div className="grid grid-cols-6">
			<div className="lg:col-span-2 col-span-6 p-4">
				<SearchEventsForm defaultValues={searchEventsDefaultValues} />
			</div>
			<div className="lg:col-span-4 col-span-6 m-4">
				<DocumentsSelectorTable
					columns={[eventName, eventDate, openEvent]}
					fetchData={fetchEvents}
				/>
			</div>
		</div>
	);
};

export default Dashboard;
