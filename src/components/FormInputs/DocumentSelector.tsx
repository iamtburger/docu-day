import { useEffect, useState } from "react";
import {
	ColumnDef,
	useReactTable,
	getCoreRowModel,
	flexRender,
	ColumnFiltersState,
	getFilteredRowModel,
	SortingState,
	getSortedRowModel,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Input,
	FileUpload,
} from "@/components";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
}

export function DocumentsSelectorTable<TData, TValue>({
	columns,
}: DataTableProps<TData, TValue>) {
	const [data, setData] = useState<TData[]>([]);

	const [rowSelection, setRowSelection] = useState({});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onRowSelectionChange: setRowSelection,
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			rowSelection,
			columnFilters,
			sorting,
		},
	});

	const fetchDocuments = async () => {
		const res = await fetch("http://localhost:3000/api/documents", {
			method: "GET",
		});
		const documents = await res.json();
		setData(documents);
	};

	useEffect(() => {
		// fetchDocuments();
	}, []);

	return (
		<div>
			<div className="flex">
				<Input
					placeholder="Filter documents..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="max-w-[40%] mb-2"
				/>
				{/* TODO: fetch data onClose */}
				<FileUpload />
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="h-12"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="pt-1 pb-1">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
