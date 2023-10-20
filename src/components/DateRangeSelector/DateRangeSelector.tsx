"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
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

function DateRangeSelector({
	className,
	control,
}: {
	className: string;
	control: SearchEventsFormControl;
}) {
	const [date, setDate] = React.useState<DateRange | undefined>({
		from: undefined,
		to: undefined,
	});

	return (
		<FormField
			control={control}
			name="dateRange"
			render={({ field }) => (
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
								onSelect={setDate}
								numberOfMonths={2}
							/>
						</PopoverContent>
					</Popover>
				</div>
			)}
		/>
	);
}

export default DateRangeSelector;
