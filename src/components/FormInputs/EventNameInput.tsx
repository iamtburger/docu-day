import { Control } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, Input } from "..";
import { DocumentSelectorFormSchema } from "@/data/types";

const EventNameFormInput = ({
	control,
}: {
	control: Control<DocumentSelectorFormSchema>;
}) => {
	return (
		<FormField
			control={control}
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
	);
};

export { EventNameFormInput };
