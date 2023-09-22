"use client";

import { CategoryInput } from "@/components/FormInputs/CategoryInput";
import { DatePickerFormInput } from "@/components/FormInputs/DatePicker";
import { DocumentsSelectorTable } from "@/components/FormInputs/FileSelector";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@auth0/nextjs-auth0/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Download, ArrowUpDown, MoreHorizontal } from "lucide-react";

const formSchema = z.object({
	username: z.string().min(2).max(40),
	name: z.string().min(3).max(100),
	description: z.string().max(500).optional(),
	eventDate: z.date(),
	uploadDate: z.date(),
	files: z.array(z.string()),
	category: z.string(),
});

function CreateEvent() {
	const { user } = useUser();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: user?.sub || "",
			name: "",
			description: "",
			eventDate: new Date(),
			uploadDate: new Date(),
			files: [],
			category: "",
		},
	});

	useEffect(() => {
		if (user?.sub !== null && user?.sub !== undefined) {
			form.setValue("username", user?.sub);
		}
	}, [user, form]);

	// TODO: fix padding on first div
	return (
		<div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-1 gap-3 lg:pl-24 md:pl-16 pl-8 lg:pr-24 md:pr-16 pr-8 pt-12">
			<div className="col-span-3 p-10">
				<Form {...form}>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="mb-6 flex flex-col">
								<FormLabel className="mt-1 mb-1">Event Name</FormLabel>
								<FormControl>
									<Input
										className=""
										required
										{...field}
										placeholder="Add a name for the event"
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<CategoryInput control={form.control} categories={languages} />
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem className="mb-6 flex flex-col">
								<FormLabel className="mt-1 mb-1">Description</FormLabel>
								<FormControl>
									<div>
										<Textarea
											{...field}
											onChange={(e) => {
												if (e.target.value.length <= 500) {
													field.onChange(e.target.value);
												}
											}}
											placeholder="Add details to the event by describing it"
										/>
										<p className="text-right text-xs relative bottom-5 right-5 opacity-25 h-0">
											{field.value?.length || 0} / 500
										</p>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
					<DatePickerFormInput control={form.control} />
				</Form>
				<Button
					onClick={async () => {
						fetch("http://localhost:3000/api/event", {
							method: "POST",
							body: JSON.stringify(form.getValues()),
						});
					}}
					className=""
				>
					Save
				</Button>
			</div>
			<div className="col-span-3 container mx-auto py-10">
				<DocumentsSelectorTable columns={columnDefinitions} data={documents} />
			</div>
		</div>
	);
}

const languages = [
	{ label: "English", value: "en" },
	{ label: "French", value: "fr" },
	{ label: "German", value: "de" },
	{ label: "Spanish", value: "es" },
	{ label: "Portuguese", value: "pt" },
	{ label: "Russian", value: "ru" },
	{ label: "Japanese", value: "ja" },
	{ label: "Korean", value: "ko" },
	{ label: "Chinese", value: "zh" },
];

const documents = [
	{
		id: "asd35f446g4",
		name: "some.txt",
		createdAt: "",
		downloadUrl: "http://localhost:3000/files/some.txt",
	},
	{
		id: "grd35f446g4",
		name: "other.txt",
		createdAt: "",
		downloadUrl: "http://localhost:3000/files/other.txt",
	},
];
type EventDocument = {
	id: string;
	name: string;
	createdAt: Date | string;
	downloadUrl?: string;
};

const columnDefinitions: ColumnDef<EventDocument>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={(value) =>
					table.toggleAllPageRowsSelected(Boolean(value))
				}
				aria-label="Select all"
				className="mt-1"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
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
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="pl-0 flex align-middle "
			>
				Upload time
				<ArrowUpDown className="ml-2 h-4 w-4 self-center cursor-pointer" />
			</div>
		),
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

export default CreateEvent;
