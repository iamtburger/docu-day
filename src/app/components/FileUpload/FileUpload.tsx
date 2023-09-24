"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	CheckCircle,
	Loader2,
	Pencil,
	X,
	XCircle,
	PlusCircle,
	Upload,
} from "lucide-react";

import "./FileUpload.css";
import prisma from "@/prisma/prisma";
import { useUser } from "@auth0/nextjs-auth0/client";

enum FileUploadStatus {
	"NOT_STARTED" = "NOT_STARTED",
	"PENDING" = "PENDING",
	"SUCCESS" = "SUCCESS",
	"ERROR" = "ERROR",
}

interface FileWithStatus {
	file: File;
	key: string;
	type: string;
	fileName?: string;
	status?: FileUploadStatus;
	fileUploadUrl?: any;
}

type SelectedFiles = FileWithStatus[];

const FileUpload = () => {
	const [selectedFiles, setSelectedFiles] = useState<FileWithStatus[]>([]);

	const { user } = useUser();

	const selectFiles = (files: FileList | null) => {
		let validFiles: FileWithStatus[] = [];
		if (files?.length !== undefined) {
			for (let i = 0; i < files?.length; i++) {
				const file = files.item(i);
				if (file?.size !== undefined) {
					validFiles = [
						...validFiles,
						{
							file: file,
							status: FileUploadStatus.NOT_STARTED,
							key: file.name,
							type: file.type,
							fileName: file.name,
						},
					];
				}
			}
		}
		setSelectedFiles(validFiles);
	};

	const removeFileFromSelection = (fileName: string) => {
		setSelectedFiles((prevState) => {
			const fileToRemoveIndex = prevState.findIndex(
				(file) => file.key === fileName
			);
			const updatedFilesList = [...prevState];
			updatedFilesList.splice(fileToRemoveIndex, 1);
			return updatedFilesList;
		});
	};

	const areFilesSelected = selectedFiles.length > 0;

	return (
		<Dialog
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					console.log("refetching table data");
				}
			}}
		>
			<DialogTrigger asChild>
				<Button className="ml-2">
					<Upload size={18} className="mr-2" />
					Upload
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>File upload</DialogTitle>
				</DialogHeader>
				{areFilesSelected ? (
					<div className="mt-4">
						{selectedFiles.map((selectedFile) => {
							return (
								<SelectedFileRow
									key={selectedFile.file.name}
									selectedFile={selectedFile}
									editFileName={(fileName) => {
										const updatedFileList = selectedFiles.map((file) =>
											file.key === selectedFile.key
												? { ...file, fileName }
												: file
										);
										setSelectedFiles(updatedFileList);
									}}
									removeFileFromSelection={() =>
										removeFileFromSelection(selectedFile.file.name)
									}
								/>
							);
						})}
					</div>
				) : (
					<p className="m-4 text-center">No files selected</p>
				)}
				<div className="flex justify-between">
					<input
						id="contained-button-file"
						type="file"
						onChange={(e) => selectFiles(e.currentTarget.files)}
						multiple
						hidden
					/>
					<label
						htmlFor="contained-button-file"
						className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
					>
						Browse...
					</label>
					{areFilesSelected && (
						<Button
							onClick={async () => {
								let params = selectedFiles.map((selectedFile) => ({
									bucketName: "docs",
									key: selectedFile.fileName,
									fileType: selectedFile.file.type,
								}));

								const response = await fetch(
									"http://localhost:3000/api/generate",
									{
										method: "POST",
										body: JSON.stringify({ params }),
									}
								);
								const { urls } = await response.json();

								for (let selectedFile of selectedFiles) {
									const selectedFileUploadUrl = urls.find(
										(url: { key: string }) => url.key === selectedFile.fileName
									);
									setPendingStatus(
										setSelectedFiles,
										selectedFiles,
										selectedFile.key
									);

									fetch(selectedFileUploadUrl?.url, {
										method: "PUT",
										body: new Blob([selectedFile.file]),
										headers: {
											"Content-Type": selectedFile.file.type,
										},
									})
										.then((res) => {
											if (Boolean(res.ok)) {
												setSuccessStatus(
													setSelectedFiles,
													selectedFiles,
													selectedFile.key
												);
											} else {
												throw new Error(
													"Something went wrong while uploading the file. Please try again later!"
												);
											}
										})
										.then(() => {
											if (
												selectedFile.fileName !== undefined &&
												user?.sub !== undefined &&
												user.sub !== null
											) {
												prisma.document.create({
													data: {
														name: selectedFile.fileName,
														user_id: user.sub,
													},
												});
											}
										})
										.catch((e) => {
											setErrorStatus(
												setSelectedFiles,
												selectedFiles,
												selectedFile.key
											);
											console.error(e);
										});
								}
							}}
						>
							Upload
						</Button>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default FileUpload;

// style each file row -> cut names, when too long and add it to tooltip
// Add more files button -> has to consider duplicate selections
// Should not be able to add more files if upload is done

interface SelectedFileRowProps {
	selectedFile: FileWithStatus;
	editFileName: (name: string) => void;
	removeFileFromSelection: () => void;
}

const SelectedFileRow = ({
	selectedFile,
	editFileName,
	removeFileFromSelection,
}: SelectedFileRowProps) => {
	const [isFileNameEditable, setIsFileNameEditable] = useState(false);
	const [showEditIcon, setShowEditIcon] = useState(false);
	const [updatedFileName, setUpdatedFileName] = useState(
		selectedFile.file.name
	);
	const { status } = selectedFile;

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				padding: "5px",
			}}
			onMouseOver={() => setShowEditIcon(true)}
			onMouseOut={() => setShowEditIcon(false)}
		>
			<div
				style={{
					height: "32px",
					fontFamily: "inherit",
				}}
				className="flex w-2/3"
				onBlur={() => {
					editFileName(updatedFileName);
					setIsFileNameEditable(false);
				}}
			>
				{isFileNameEditable ? (
					<Input
						value={updatedFileName}
						onChange={(e) => setUpdatedFileName(e.target.value)}
						autoFocus
					/>
				) : (
					<div className="self-center truncate">{updatedFileName}</div>
				)}
				{showEditIcon && !isFileNameEditable && (
					<Pencil
						onClick={() => setIsFileNameEditable((prevState) => !prevState)}
						className="ml-2 self-center"
						size="18"
					/>
				)}
			</div>
			<div className="self-center">
				{status === FileUploadStatus.NOT_STARTED && (
					<X onClick={removeFileFromSelection} size={16} />
				)}
				{status === FileUploadStatus.PENDING && (
					<Loader2 className="animate-spin" />
				)}
				{status === FileUploadStatus.SUCCESS && <CheckCircle />}
				{status === FileUploadStatus.ERROR && <XCircle />}
			</div>
		</div>
	);
};

type SetSelectedFilesState = Dispatch<SetStateAction<FileWithStatus[]>>;

function updateStatus(status: FileUploadStatus) {
	return (
		setState: SetSelectedFilesState,
		files: SelectedFiles,
		key: string
	) => {
		setState((prevState) => {
			const updatedFilesList = prevState.map((file) =>
				file.key === key ? { ...file, status } : file
			);
			return updatedFilesList;
		});
	};
}

const setPendingStatus = updateStatus(FileUploadStatus.PENDING);
const setSuccessStatus = updateStatus(FileUploadStatus.SUCCESS);
const setErrorStatus = updateStatus(FileUploadStatus.ERROR);
