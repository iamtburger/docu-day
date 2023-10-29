import { useState } from "react";
import {
	ColumnDef,
	useReactTable,
	getCoreRowModel,
	flexRender,
	ColumnFiltersState,
	getFilteredRowModel,
	SortingState,
	getSortedRowModel,
	Table as TableType,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components";

interface DocumentsSelectorTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	isLoading: boolean;
}

function DataTable<TData, TValue>({
	columns,
	data,
	isLoading = false,
}: DocumentsSelectorTableProps<TData, TValue>) {
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

	return (
		<div>
			<div className="rounded-md border overflow-y-scroll max-h-[60vh]">
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
						{getTableContent(isLoading, table, columns.length)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

export default DataTable;

function getTableContent<TData>(
	isLoading: boolean,
	table: TableType<TData>,
	colSpan: number
) {
	if (isLoading) {
		return (
			<TableRow>
				<TableCell colSpan={colSpan} className="h-24 text-center">
					Loading...
				</TableCell>
			</TableRow>
		);
	} else if (!isLoading && table.getRowModel().rows?.length) {
		return (
			<>
				{table.getRowModel().rows.map((row) => (
					<TableRow
						key={row.id}
						data-state={row.getIsSelected() && "selected"}
						className="h-12"
					>
						{row.getVisibleCells().map((cell) => (
							<TableCell key={cell.id} className="pt-1 pb-1">
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</TableCell>
						))}
					</TableRow>
				))}
			</>
		);
	} else {
		return (
			<TableRow>
				<TableCell colSpan={colSpan} className="h-24 text-center">
					No results.
				</TableCell>
			</TableRow>
		);
	}
}
