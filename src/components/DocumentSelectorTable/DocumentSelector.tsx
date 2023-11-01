import { useCallback, useEffect, useState } from "react";
import { ColumnDef, Table as TableType } from "@tanstack/react-table";
import { useUser } from "@auth0/nextjs-auth0/client";

import { Input, FileUpload } from "@/components";
import { RequestState } from "@/data/enums";
import DataTable from "../DataTable/DataTable";
import { fetchDocuments } from "@/requests";

interface DocumentsSelectorTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	defaultRowSelection?: number[];
}

function DocumentsSelectorTable<TData, TValue>({
	columns,
	defaultRowSelection,
}: DocumentsSelectorTableProps<TData, TValue>) {
	const [data, setData] = useState<TData[]>([]);
	const [requestState, setRequestState] = useState<RequestState>(
		RequestState.NOT_STARTED
	);
	const [searchTerm, setSearchTerm] = useState("");
	const { user } = useUser();

	const handleFetchData = useCallback(async () => {
		setRequestState(RequestState.PENDING);
		try {
			const res = await fetchDocuments();
			const { data } = await res.json();
			setData(data);
			setRequestState(RequestState.SUCCESS);
		} catch (e) {
			console.error("Something went wrong while fetching Documents", e);
			setRequestState(RequestState.ERROR);
		}
	}, []);

	useEffect(() => {
		if (Boolean(user)) {
			handleFetchData();
		}
	}, [user, handleFetchData]);

	return (
		<div>
			<div className="flex">
				<Input
					placeholder="Filter documents..."
					value={searchTerm}
					onChange={(event) => setSearchTerm(event.target.value)}
					className="max-w-[40%] mb-2"
				/>
				<FileUpload onClose={handleFetchData} />
			</div>
			<DataTable
				columns={columns}
				data={data}
				isLoading={requestState === RequestState.PENDING}
				globalFilter={searchTerm}
				setGlobalFilter={setSearchTerm}
				defaultRowSelection={defaultRowSelection}
			/>
		</div>
	);
}

export default DocumentsSelectorTable;
