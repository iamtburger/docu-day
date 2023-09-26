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

// TODO: fix type
export function DatePicker({
	value,
	onChange,
}: {
	value: Date;
	onChange: (...event: any[]) => void;
}) {
	const [date, setDate] = React.useState<Date>();

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
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
					onSelect={onChange}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
