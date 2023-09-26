import { Control } from "react-hook-form";

import { EventFormSchema } from "@/data/types";
import { FormField, FormItem, FormLabel, FormControl, Textarea } from "..";

const EventDescriptionFormInput = ({
	control,
}: {
	control: Control<EventFormSchema>;
}) => (
	<FormField
		control={control}
		name="description"
		render={({ field }) => (
			<FormItem className="mb-6 flex flex-col">
				<FormLabel className="mt-1 mb-1">Description</FormLabel>
				<FormControl>
					<div>
						<Textarea
							{...field}
							onChange={(e) => {
								if (e.target.value.length <= 500) {
									field.onChange(e.target.value);
								}
							}}
							placeholder="Add details to the event by describing it"
						/>
						<p className="text-right text-xs relative bottom-5 right-5 opacity-25 h-0">
							{field.value?.length || 0} / 500
						</p>
					</div>
				</FormControl>
			</FormItem>
		)}
	/>
);

export { EventDescriptionFormInput };
