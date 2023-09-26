"use client";

import { useCallback, useEffect, useState } from "react";
import { Control } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/utils/utils";
import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components";
import { EventFormSchema } from "@/data/types";

export function CategoryInput({
	control,
}: {
	control: Control<EventFormSchema>;
}) {
	const [categories, setCategories] = useState<{ id: string; name: string }[]>(
		[]
	);

	const getCategories = useCallback(async () => {
		const response = await fetch("http://localhost:3000/api/categories");
		const fetchedCategories = await response.json();
		setCategories(fetchedCategories);
	}, [setCategories]);

	useEffect(() => {
		getCategories();
	}, [getCategories]);

	return (
		<FormField
			control={control}
			name="category"
			render={({ field }) => (
				<FormItem className="flex flex-col pb-5">
					<FormLabel>Category</FormLabel>
					<Popover>
						<PopoverTrigger asChild>
							<FormControl>
								<Button
									variant="outline"
									role="combobox"
									className={cn(
										"w-[200px] justify-between",
										!field.value && "text-muted-foreground"
									)}
								>
									{field.value
										? categories.find((category) => category.id === field.value)
												?.name
										: "Select category"}
									<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className="w-[200px] p-0">
							<Command>
								<CommandInput placeholder="Search framework..." />
								<CommandEmpty>No category found.</CommandEmpty>
								<CommandGroup>
									{categories.map((category) => (
										<CommandItem
											value={category.id}
											key={category.id}
											onSelect={() => {
												field.onChange(category.id);
											}}
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													category.id === field.value
														? "opacity-100"
														: "opacity-0"
												)}
											/>
											{category.name}
										</CommandItem>
									))}
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
