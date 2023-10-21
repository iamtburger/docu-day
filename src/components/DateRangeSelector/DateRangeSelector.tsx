"use client";

import * as React from "react";
import { addDays, format, isAfter, isBefore } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/utils/utils";
import { Button } from "@/components/ShadcnUi/button";
import { Calendar } from "@/components/ShadcnUi/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ShadcnUi/popover";
import { FormField } from "..";
import { SearchEventsFormControl } from "@/data/types";

// TODO: completely rewrite date range as you can't select start date proper
const disabledDate = new Date();

function DateRangeSelector({
	className,
	control,
}: // defaultValues = { to: undefined, from: undefined },
{
	className: string;
	control: SearchEventsFormControl;
	// defaultValues?: DateRange;
}) {
	// const [date, setDate] = React.useState<DateRange | undefined>(defaultValues);

	return (
		<FormField
			control={control}
			name="dateRange"
			render={({ field: { value: date, onChange } }) => {
				// const handleRangeSelection = (
				// 	range: DateRange | undefined,
				// 	selectedDate: Date
				// ) => {
				// 	// const handleSelect = (range: DateRange | undefined, selectedDate: Date) => {
				// 	onChange(() => {
				// 		if (range && rangeIncludeDate(range, disabledDate)) {
				// 			if (range.from && isBefore(selectedDate, disabledDate)) {
				// 				return { from: range.from, to: undefined };
				// 			}
				// 			return { from: range.to, to: undefined };
				// 		}
				// 		return range;
				// 	});
				// 	// };
				// };
				return (
					<div className={cn("grid gap-2", className)}>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									id="date"
									variant={"outline"}
									className={cn(
										"w-full justify-start text-left font-normal",
										!date && "text-muted-foreground"
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{date?.from ? (
										date.to ? (
											<>
												{format(date.from, "dd/LL/y")} -{" "}
												{format(date.to, "dd/LL/y")}
											</>
										) : (
											format(date.from, "dd/LL/y")
										)
									) : (
										<span>Pick a date</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									initialFocus
									mode="range"
									defaultMonth={date?.from}
									selected={date}
									onSelect={onChange}
									numberOfMonths={2}
									min={2}
								/>
							</PopoverContent>
						</Popover>
					</div>
				);
			}}
		/>
	);
}

function rangeIncludeDate(range: DateRange, date: Date) {
	return Boolean(
		range.from &&
			range.to &&
			isAfter(date, range.from) &&
			isBefore(date, range.to)
	);
}

export default DateRangeSelector;
