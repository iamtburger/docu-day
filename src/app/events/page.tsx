"use client";

import { DocumentsSelectorTable } from "@/components";
import {
	createdAt,
	fileName,
	download,
} from "@/components/DocumentSelectorTable/columnDefinitions";
import { getDocumentSelectorTableDef } from "@/components/DocumentSelectorTable/tableDefinitions";
import SearchEventsForm from "@/components/Forms/SearchEventsForm/SearchEventsForm";
import { searchEventsDefaultValues } from "@/data/formData";
import { getSession } from "@auth0/nextjs-auth0";
import { useUser } from "@auth0/nextjs-auth0/client";
import { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";

const Dashboard: NextPage = () => {
	return (
		<div className="grid grid-cols-6">
			<div className="lg:col-span-2 md:col-span-3 col-span-6 p-4">
				<SearchEventsForm defaultValues={searchEventsDefaultValues} />
			</div>
			{/* Create a table for this specific view */}
			<div className="col-span-4">
				<DocumentsSelectorTable columns={[fileName, createdAt, download]} />
			</div>
		</div>
	);
};

export default Dashboard;
