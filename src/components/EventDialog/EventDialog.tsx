import { ArrowUpRightSquare } from "lucide-react";
import { Row } from "@tanstack/react-table";

import {
	Button,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from "../ShadcnUi";
import { Event } from "@/data/types";
import { getFormattedDate } from "@/utils/utils";
import { useState } from "react";
import { Badge } from "../ShadcnUi/badge";
import { Separator } from "../ShadcnUi/separator";
import { deleteEvent } from "@/requests/requests";
import { useToast } from "../ShadcnUi/use-toast";

// Format description
// Add list of files
// delete button -> make it red and add a popup to confirm -> toast

// TODO: move these components from the column definitions module
const EventDialog = ({
	name,
	category,
	description,
	id,
	eventDate,
}: {
	name: string;
	category: string;
	description: string;
	id: number;
	eventDate: string;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const { toast } = useToast();

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger>
				<ArrowUpRightSquare size={16} />
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>Event Details</DialogHeader>
				<div className="flex pl-1">
					<div className="text-3xl underline decoration-solid decoration-inherit decoration-1">
						{name}
					</div>
				</div>
				<div className="text-xs font-light italic flex align-middle pl-1">
					<Badge className="w-fit h-fit capitalize mr-4 text-xs">
						{category}
					</Badge>
					<p className="self-center">{getFormattedDate(eventDate)}</p>
				</div>
				<Separator />
				<div className="min-h-[50px] p-1">{description}</div>
				<DialogFooter>
					<DeleteItemDialog
						title="Are you sure you want to delete this event?"
						onDelete={() => {
							deleteEvent(id)
								.then((res) => {
									toast({
										title: "Event deleted",
									});
								})
								.then(() => {
									setIsOpen(false);
								})
								.catch((e) => {
									toast({
										title: "Something went wrong",
									});
									console.error(e);
								});
						}}
					/>
					<Button onClick={() => setIsOpen(false)}>Close</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

const DeleteItemDialog = ({
	title,
	onDelete,
}: {
	title: string;
	onDelete: () => void;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive" onClick={() => setIsOpen(true)}>
					Delete
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>{title}</DialogHeader>
				<DialogFooter>
					<Button onClick={() => setIsOpen(false)}>Cancel</Button>
					<Button
						variant="destructive"
						onClick={() => {
							onDelete();
							setIsOpen(false);
						}}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EventDialog;
