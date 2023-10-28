"use client";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ShadcnUi/popover";
import { useEffect, useState } from "react";
import {
	Button,
	DatePicker,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components";
import { cn } from "@/utils/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { SearchEventsFormControl } from "@/data/types";
import { useWatch } from "react-hook-form";

const DateRangeSelector = ({
	control,
}: {
	control: SearchEventsFormControl;
}) => {
	const [popoverOpen, setPopoverOpen] = useState(false);

	const { from: dateRangeFrom } = useWatch({ control, name: "dateRange" });

	const formatDisplayDate = (date: Date | undefined) =>
		date ? format(date, "PP") : "Pick a Date";

	useEffect(() => {
		const link = document.getElementById("to-selector") as HTMLElement;
		if (link !== null) {
			link.click();
		}
	}, [dateRangeFrom]);

	return (
		<FormField
			control={control}
			name="dateRange"
			render={({ field: { value, onChange } }) => {
				console.log(value);
				const disableDateAfterEnd = (day: Date) =>
					day < new Date(value.from || "");

				const disableDateBeforeStart = (day: Date) =>
					day > new Date(value.to || "");

				return (
					<FormItem>
						<FormLabel>Event date range</FormLabel>
						<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant={"outline"}
										className={cn(
											"w-full justify-start text-left font-normal",
											!(value.from || value.to) && "text-muted-foreground"
										)}
									>
										{!(value.from || value.to) ? (
											<span>Pick a date</span>
										) : (
											`${formatDisplayDate(value.from)} - ${formatDisplayDate(
												value.to
											)}`
										)}
										<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className="flex p-8 lg:w-fit w-[380px] m-4  flex-wrap">
								<div className="lg:mr-4 md:mr-4 sm:mb-2">
									<DatePicker
										id="from-selector"
										value={value.from}
										onChange={(date) =>
											onChange(() => ({ ...value, from: date }))
										}
										disabled={disableDateBeforeStart}
										label="From"
									/>
								</div>
								<DatePicker
									id="to-selector"
									value={value.to}
									onChange={(date) => {
										onChange(() => ({ ...value, to: date }));
										setPopoverOpen(false);
									}}
									disabled={disableDateAfterEnd}
									label="To"
								/>
							</PopoverContent>
						</Popover>
					</FormItem>
				);
			}}
		/>
	);
};

export default DateRangeSelector;
