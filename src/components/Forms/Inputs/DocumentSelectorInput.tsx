import { Control } from "react-hook-form";

import { FormField, FormItem } from "../../ShadcnUi";
import { EventDocument, EventFormSchema } from "@/data/types";
import DocumentsSelectorTable from "../../DocumentSelectorTable";
import { getDocumentSelectorTableDef } from "../../DocumentSelectorTable/tableDefinitions";

const DocumentSelectorFormInput = ({
	control,
	defaultRowSelection,
}: {
	control: Control<EventFormSchema>;
	defaultRowSelection?: number[];
}) => {
	return (
		<FormField
			control={control}
			name="documents"
			render={({ field }) => (
				<FormItem>
					<DocumentsSelectorTable
						columns={getDocumentSelectorTableDef(
							(value) => field.onChange(value),
							field.value
						)}
						defaultRowSelection={defaultRowSelection}
					/>
				</FormItem>
			)}
		/>
	);
};

export { DocumentSelectorFormInput };
