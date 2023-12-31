"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/utils/utils";
import {
	Button,
	Calendar,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components";
import { CreateEventFormControl } from "@/data/types";

export function DatePickerFormInput({
	control,
}: {
	control: CreateEventFormControl;
}) {
	return (
		<FormField
			control={control}
			name="eventDate"
			render={({ field }) => (
				<FormItem className="flex flex-col mb-6">
					<FormLabel>Event Date</FormLabel>
					<Popover>
						<PopoverTrigger asChild>
							<FormControl>
								<Button
									variant={"outline"}
									className={cn(
										"w-[240px] pl-3 text-left font-normal",
										!field.value && "text-muted-foreground"
									)}
								>
									{field.value ? (
										format(field.value, "PPP")
									) : (
										<span>Pick a date</span>
									)}
									<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={field.value}
								onSelect={field.onChange}
								disabled={(date) =>
									date > new Date() || date < new Date("1900-01-01")
								}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
