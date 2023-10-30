import { ColumnDef } from "@tanstack/react-table";

import { Event, EventDocument } from "@/data/types";
import {
	createdAt,
	download,
	fileName,
	selectRow,
	//openEvent,
} from "./columnDefinitions";

export const getDocumentSelectorTableDef = (
	onRowSelectionChange: (value: any) => void,
	previousValue: any
): ColumnDef<EventDocument>[] => [
	selectRow(onRowSelectionChange, previousValue),
	fileName,
	createdAt,
	download,
];

// const eventsTableDef = (
// 	onRowSelectionChange: (value: any) => void,
// 	previousValue: any
// ): ColumnDef<Event>[] => [openEvent];
