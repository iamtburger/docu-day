import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function downloadFile(url: string, fileName: string) {
	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("download", fileName);
	link.setAttribute("target", "_blank");
	link.click();
	link.remove();
}

export const getFolderName = (userId: string) => userId.replace("|", "-");

export const getFormattedDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};

export function composeSearchParams(
	arg: {
		[key: string]: string | number | undefined | Date;
	},
	emptyValues: { [key: string]: string | undefined }
) {
	const keysArray = Object.keys(arg);
	if (keysArray.length === 0) {
		return "";
	}
	return keysArray.reduce((acc, curr) => {
		if (emptyValues[curr] !== arg[curr]) {
			acc = `${acc}${acc === "?" ? "" : "&"}${curr}=${arg[curr]}`;
			return acc;
		}
		return acc;
	}, "?");
}

export function mapEventsWithCategories(events: any, categories: any) {
	return events.map((event: any) => {
		return {
			id: event.id,
			name: event.name,
			eventDate: event.event_date,
			description: event.description,
			category: (categories ?? []).find(
				(category: any) => event.category_id === category.id
			)?.name,
		};
	});
}
