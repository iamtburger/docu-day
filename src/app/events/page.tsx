"use client";

import SearchEventsForm from "@/components/Forms/SearchEventsForm/SearchEventsForm";
import { searchEventsDefaultValues } from "@/data/formData";
import { NextPage } from "next";

const Dashboard: NextPage = () => {
	return (
		<div className="grid grid-cols-6">
			<SearchEventsForm defaultValues={searchEventsDefaultValues} />
		</div>
	);
};

export default Dashboard;
