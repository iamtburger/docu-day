"use client";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ShadcnUi/popover";
import { Calendar } from "@/components/ShadcnUi/calendar";
import { useCallback, useEffect, useState } from "react";
import { Button, DatePicker, Input } from "..";
import { cn } from "@/utils/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const DateRange2 = () => {
	const [date, setDate] = useState<{
		from: Date | undefined;
		to: Date | undefined;
	}>({ from: undefined, to: undefined });
	const [popoverOpen, setPopoverOpen] = useState(false);

	const formatDisplayDate = (date: Date | undefined) =>
		date ? format(date, "PP") : "Pick a Date";

	useEffect(() => {
		const link = document.getElementById("to-selector") as HTMLElement;
		if (link !== null) {
			link.click();
		}
	}, [date.from]);

	const disableDateAfterEnd = useCallback(
		(day: Date) => day < new Date(date.from || ""),
		[date.from]
	);

	const disableDateBeforeStart = useCallback(
		(day: Date) => day > new Date(date.to || ""),
		[date.to]
	);

	return (
		<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-full justify-start text-left font-normal",
						!(date.from || date.to) && "text-muted-foreground"
					)}
				>
					{!(date.from || date.to) ? (
						<span>Pick a date</span>
					) : (
						`${formatDisplayDate(date.from)} - ${formatDisplayDate(date.to)}`
					)}
					<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="flex p-8 lg:w-fit w-[380px] m-4  flex-wrap">
				<div className="lg:mr-4 md:mr-4 sm:mb-2">
					<DatePicker
						id="from-selector"
						value={date.from}
						onChange={(date) =>
							setDate((prevState) => ({ ...prevState, from: date }))
						}
						disabled={disableDateBeforeStart}
					/>
				</div>
				<DatePicker
					id="to-selector"
					value={date.to}
					onChange={(date) => {
						setDate((prevState) => ({ ...prevState, to: date }));
						setPopoverOpen(false);
					}}
					disabled={disableDateAfterEnd}
				/>
			</PopoverContent>
		</Popover>
	);
};

export default DateRange2;
