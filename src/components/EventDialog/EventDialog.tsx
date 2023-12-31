import { ArrowUpRightSquare, Download } from "lucide-react";
import { Row } from "@tanstack/react-table";

import {
	Button,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from "../ShadcnUi";
import { EventDocument } from "@/data/types";
import { downloadFile, getFormattedDate } from "@/utils/utils";
import { useEffect, useState } from "react";
import { Badge } from "../ShadcnUi/badge";
import { Separator } from "../ShadcnUi/separator";
import {
	deleteEvent,
	fetchDocumentDownloadUrl,
	fetchDocuments,
} from "@/requests/requests";
import { useToast } from "../ShadcnUi/use-toast";

const EventDialog = ({
	name,
	category,
	description,
	id,
	eventDate,
	refreshDataTable,
}: {
	name: string;
	category: string;
	description: string;
	id: number;
	eventDate: string;
	refreshDataTable: () => void;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const { toast } = useToast();

	const [documents, setDocuments] = useState<EventDocument[]>([]);

	useEffect(() => {
		try {
			if (isOpen) {
				(async function () {
					const res = await fetchDocuments(id);
					const { data } = await res.json();
					setDocuments(data);
				})();
			}
		} catch (e) {
			console.log("Something went wrong while fetching documents", e);
			setDocuments([]);
		}
	}, [isOpen, id]);

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
				<div>
					{documents.map((document) => (
						<div key={document.id}>
							<div className="flex justify-between align-middle pl-1 pr-1">
								<div>{document.name}</div>
								<Download
									size={16}
									className="self-center"
									onClick={async () => {
										if (document.name !== undefined) {
											try {
												const res = await fetchDocumentDownloadUrl(
													document.name
												);
												const { downloadUrl } = await res.json();
												downloadFile(downloadUrl, document.name);
											} catch (e) {
												console.error(e);
												toast({ title: "Something went wrong" });
											}
										}
									}}
								/>
							</div>
							<Separator />
						</div>
					))}
				</div>
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
									refreshDataTable();
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
