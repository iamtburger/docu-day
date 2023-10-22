import {
	Button,
	DatePicker,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	Input,
} from "@/components";
import { SearchEventsFormControl } from "@/data/types";

const EventSearchInput = ({
	control,
}: {
	control: SearchEventsFormControl;
}) => {
	return (
		<FormField
			control={control}
			name="searchTerm"
			render={({ field: { value, onChange } }) => {
				return (
					<FormItem>
						<FormLabel>Search ??</FormLabel>
						<FormControl>
							<Input onChange={onChange} value={value} placeholder="Car" />
						</FormControl>
					</FormItem>
				);
			}}
		/>
	);
};

export default EventSearchInput;
