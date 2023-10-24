import { useCallback, useEffect, useState } from "react";
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
import { useUser } from "@auth0/nextjs-auth0/client";

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
import { RequestState } from "@/data/enums";

interface DocumentsSelectorTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	withFilter?: boolean;
	withFileUpload?: boolean;
	fetchData: () => Promise<Response>;
}

function DocumentsSelectorTable<TData, TValue>({
	columns,
	fetchData,
	withFilter = false,
	withFileUpload = false,
}: DocumentsSelectorTableProps<TData, TValue>) {
	const [data, setData] = useState<TData[]>([]);
	const [requestState, setRequestState] = useState<RequestState>(
		RequestState.NOT_STARTED
	);
	const { user } = useUser();

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

	const handleFetchData = useCallback(async () => {
		setRequestState(RequestState.PENDING);
		try {
			const res = await fetchData();
			const { data } = await res.json();
			setData(data);
			setRequestState(RequestState.SUCCESS);
		} catch (e) {
			console.error("Something went wrong while fetching Documents", e);
			setRequestState(RequestState.ERROR);
		}
	}, [fetchData]);

	useEffect(() => {
		if (Boolean(user)) {
			handleFetchData();
		}
	}, [user, handleFetchData]);

	return (
		<div>
			<div className="flex">
				{withFilter && (
					<Input
						placeholder="Filter documents..."
						value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
						onChange={(event) =>
							table.getColumn("name")?.setFilterValue(event.target.value)
						}
						className="max-w-[40%] mb-2"
					/>
				)}
				{withFileUpload && <FileUpload onClose={handleFetchData} />}
			</div>
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
						{getTableContent(
							requestState === RequestState.PENDING,
							table,
							columns.length
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

export default DocumentsSelectorTable;

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
