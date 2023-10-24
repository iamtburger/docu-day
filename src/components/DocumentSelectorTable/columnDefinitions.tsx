import { ArrowUpDown, Download, ArrowUpRightSquare } from "lucide-react";
import { Column, ColumnDef, Row } from "@tanstack/react-table";

import {
	Checkbox,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from "../ShadcnUi";
import { Event, EventDocument } from "@/data/types";
import { downloadFile, getFormattedDate } from "@/utils/utils";
import { fetchDocumentDownloadUrl } from "@/requests";
import { useState } from "react";
import { Badge } from "../ShadcnUi/badge";

export const selectRow = (
	onRowSelectionChange: (value: any) => void,
	previousValue: any
): ColumnDef<EventDocument> => ({
	id: "select",
	header: ({ table }) => (
		<Checkbox
			checked={table.getIsAllPageRowsSelected()}
			onCheckedChange={(value) => {
				if (value) {
					onRowSelectionChange(
						table.getRowModel().rows.map((row) => row.original)
					);
				} else {
					onRowSelectionChange([]);
				}
				table.toggleAllPageRowsSelected(Boolean(value));
			}}
			aria-label="Select all"
			className="mt-1"
		/>
	),
	cell: ({ row }) => (
		<Checkbox
			checked={row.getIsSelected()}
			onCheckedChange={(value) => {
				if (value) {
					onRowSelectionChange([...previousValue, row.original]);
				} else {
					onRowSelectionChange([
						...previousValue.filter(
							(rowValue: any) => rowValue.id !== row.original.id
						),
					]);
				}
				row.toggleSelected(Boolean(value));
			}}
			aria-label="Select row"
			className="mt-1"
		/>
	),
	enableSorting: false,
	enableHiding: false,
});

export const fileName = {
	accessorKey: "name",
	header: ({ column }: { column: Column<EventDocument, unknown> }) => (
		<div
			onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			className="pl-0 flex align-middle "
		>
			Name
			<ArrowUpDown className="ml-2 h-4 w-4 self-center cursor-pointer" />
		</div>
	),
};

export const createdAt = {
	accessorKey: "createdAt",
	header: ({ column }: { column: Column<EventDocument, unknown> }) => (
		<div
			onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
			className="pl-0 flex align-middle justify-end"
		>
			Upload time
			<ArrowUpDown className="ml-2 h-4 w-4 self-center cursor-pointer" />
		</div>
	),
	cell: ({ row }: { row: Row<EventDocument> }) => {
		const date = new Date(row.original.createdAt);
		const formattedDate = date.toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
		return <div className="text-right">{formattedDate}</div>;
	},
};

export const download = {
	accessorKey: "download",
	header: "",
	cell: ({ row }: { row: Row<EventDocument> }) => (
		<div className="flex justify-center cursor-pointer">
			<Download
				size={16}
				onClick={async () => {
					if (row.original.name !== undefined) {
						const res = await fetchDocumentDownloadUrl(row.original.name);
						const { downloadUrl } = await res.json();
						downloadFile(downloadUrl, row.original.name);
					}
				}}
			/>
		</div>
	),
};

// Format description
// Add list of files
// delete button -> make it red and add a popup to confirm -> toast
export const openEvent = {
	accessorKey: "openEvent",
	header: "",
	cell: ({ row }: { row: Row<Event> }) => {
		return (
			<div className="flex justify-center cursor-pointer">
				<Dialog>
					<DialogTrigger>
						<ArrowUpRightSquare size={16} />
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>Event Details</DialogHeader>
						<div className="flex">
							<div className="text-lg underline decoration-solid decoration-inherit decoration-1 italic">
								{row.original.name}
							</div>
							<Badge className="w-fit capitalize ml-4">
								{row.original.category}
							</Badge>
						</div>
						<div className="text-xs font-light">
							{getFormattedDate(row.original.eventDate)}
						</div>
						<div>{row.original.description}</div>
						<DialogFooter>Delete</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		);
	},
};

export const eventName = {
	accessorKey: "name",
	header: ({ column }: { column: Column<Event, unknown> }) => (
		<div
			onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			className="pl-0 flex align-middle "
		>
			Name
			<ArrowUpDown className="ml-2 h-4 w-4 self-center cursor-pointer" />
		</div>
	),
};

export const eventDate = {
	accessorKey: "eventDate",
	header: ({ column }: { column: Column<Event, unknown> }) => (
		<div
			onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
			className="pl-0 flex align-middle justify-end"
		>
			Upload time
			<ArrowUpDown className="ml-2 h-4 w-4 self-center cursor-pointer" />
		</div>
	),
	cell: ({ row }: { row: Row<Event> }) => {
		const date = new Date(row.original.eventDate);
		const formattedDate = date.toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
		return <div className="text-right">{formattedDate}</div>;
	},
};
