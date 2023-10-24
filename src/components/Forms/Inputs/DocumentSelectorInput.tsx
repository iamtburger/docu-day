import { Control } from "react-hook-form";

import { FormField, FormItem } from "../../ShadcnUi";
import { EventFormSchema } from "@/data/types";
import DocumentsSelectorTable from "../../DocumentSelectorTable";
import { getDocumentSelectorTableDef } from "../../DocumentSelectorTable/tableDefinitions";
import { fetchDocuments } from "@/requests";

const DocumentSelectorFormInput = ({
	control,
}: {
	control: Control<EventFormSchema>;
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
						withFileUpload
						withFilter
						fetchData={fetchDocuments}
					/>
				</FormItem>
			)}
		/>
	);
};

export { DocumentSelectorFormInput };
