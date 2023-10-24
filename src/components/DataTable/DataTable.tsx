"use client";

import { useState } from "react";
import {
	ColumnFiltersState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
	Table as TableType,
	ColumnDef,
} from "@tanstack/react-table";
import { Table } from "lucide-react";

import {
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "../ShadcnUi";

interface DataTableProps<TData, TValue> {
	isLoading: boolean;
	data: TData[];
	columns: ColumnDef<TData, TValue>[];
}

function DataTable<TData, TValue>({
	isLoading,
	data = [],
	columns,
}: DataTableProps<TData, TValue>) {
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
			<TableBody>{getTableContent(isLoading, table, columns.length)}</TableBody>
		</Table>
	);
}

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

export default DataTable;
