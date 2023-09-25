import { Control } from "react-hook-form";
import { ArrowUpDown, Download } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox, FormField, FormItem } from "../ShadcnUi";
import { DocumentSelectorFormSchema } from "@/data/types";
import { DocumentsSelectorTable } from "./DocumentSelector";

const DocumentSelectorFormInput = ({
	control,
}: {
	control: Control<DocumentSelectorFormSchema>;
}) => (
	<FormField
		control={control}
		name="documents"
		render={({ field }) => (
			<FormItem>
				<DocumentsSelectorTable
					columns={getColumnDefinitions(
						(value) => field.onChange(value),
						field.value
					)}
				/>
			</FormItem>
		)}
	/>
);

export { DocumentSelectorFormInput };

type EventDocument = {
	id: string;
	name: string;
	createdAt: Date | string;
	downloadUrl?: string;
};

const getColumnDefinitions = (
	onRowSelectionChange: (value: any) => void,
	previousValue: any
): ColumnDef<EventDocument>[] => [
	{
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
	},
	{
		accessorKey: "name",
		header: ({ column }) => (
			<div
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="pl-0 flex align-middle "
			>
				Name
				<ArrowUpDown className="ml-2 h-4 w-4 self-center cursor-pointer" />
			</div>
		),
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<div
				onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
				className="pl-0 flex align-middle justify-end"
			>
				Upload time
				<ArrowUpDown className="ml-2 h-4 w-4 self-center cursor-pointer" />
			</div>
		),
		cell: ({ row }) => {
			const formattedCell = "12/10/2023";

			return <div className="text-right">{formattedCell}</div>;
		},
	},
	{
		accessorKey: "downloadUrl",
		header: " Download",
		cell: ({ row }) => (
			<a href={row.original.downloadUrl} className="flex justify-center">
				<Download size={16} />
			</a>
		),
	},
];
