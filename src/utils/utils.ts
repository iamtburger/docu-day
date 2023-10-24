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
