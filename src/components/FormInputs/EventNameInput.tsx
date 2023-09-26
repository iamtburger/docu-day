import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, Input } from "..";
import { EventFormSchema } from "@/data/types";

const EventNameFormInput = ({
	control,
}: {
	control: Control<EventFormSchema>;
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
