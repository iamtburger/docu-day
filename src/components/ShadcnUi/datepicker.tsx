"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/utils/utils";
import { Button } from "@/components/ShadcnUi/button";
import { Calendar } from "@/components/ShadcnUi/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ShadcnUi/popover";
import { useState } from "react";
import { DayPickerBase } from "react-day-picker";

// TODO: fix type
export function DatePicker({
	value,
	onChange,
	id,
	disabled,
}: {
	value: Date | undefined;
	onChange: (...event: any[]) => void;
	id: string;
	disabled?: any;
}) {
	const [date, setDate] = useState<Date>();
	const [calendarOpen, setCalendarOpen] = useState(false);

	return (
		<Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
			<PopoverTrigger asChild>
				<Button
					id={id}
					variant={"outline"}
					className={cn(
						"w-[280px] justify-start text-left font-normal",
						!value && "text-muted-foreground"
					)}
				>
					{value ? format(value, "PPP") : <span>Pick a date</span>}
					<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={value}
					onSelect={(date) => {
						onChange(date);
						setCalendarOpen(false);
					}}
					initialFocus
					disabled={disabled}
				/>
			</PopoverContent>
		</Popover>
	);
}
