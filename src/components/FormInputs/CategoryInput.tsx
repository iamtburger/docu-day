"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
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

export function CategoryInput({
	control,
	categories,
}: {
	control: any;
	categories: { label: string; value: string }[];
}) {
	return (
		<FormField
			control={control}
			name="category"
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel>Language</FormLabel>
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
										? categories.find(
												(language) => language.value === field.value
										  )?.label
										: "Select language"}
									<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className="w-[200px] p-0">
							<Command>
								<CommandInput placeholder="Search framework..." />
								<CommandEmpty>No framework found.</CommandEmpty>
								<CommandGroup>
									{categories.map((language) => (
										<CommandItem
											value={language.label}
											key={language.value}
											onSelect={() => {
												field.onChange(language.value);
											}}
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													language.value === field.value
														? "opacity-100"
														: "opacity-0"
												)}
											/>
											{language.label}
										</CommandItem>
									))}
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
					<FormDescription>
						This is the language that will be used in the dashboard.
					</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
