import { ColumnDef } from "@tanstack/react-table";

import { EventDocument } from "@/data/types";
import { createdAt, download, fileName, selectRow } from "./columnDefinitions";

export const getDocumentSelectorTableDef = (
	onRowSelectionChange: (value: any) => void,
	previousValue: any
): ColumnDef<EventDocument>[] => [
	selectRow(onRowSelectionChange, previousValue),
	fileName,
	createdAt,
	download,
];
