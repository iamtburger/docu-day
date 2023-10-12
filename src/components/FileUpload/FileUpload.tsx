"use client";

import {
	Dispatch,
	SetStateAction,
	useCallback,
	useMemo,
	useState,
} from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { CheckCircle, Loader2, Pencil, X, XCircle, Upload } from "lucide-react";

import {
	Button,
	Input,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components";
import { RequestState } from "@/data/enums";
import { createDocument, generateUploadUrls, uploadFiles } from "@/requests";
import { FileWithStatus } from "@/data/types";
import { fileUploadLabels } from "@/data/labels";
import UploadButton from "./UploadButton";

type SelectedFiles = FileWithStatus[];

const FileUpload = ({ onClose }: { onClose: () => void }) => {
	const [selectedFiles, setSelectedFiles] = useState<SelectedFiles>([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { user } = useUser();

	const selectFiles = useCallback(
		(files: FileList | null) => {
			let validFiles: FileWithStatus[] = [];
			if (files?.length !== undefined) {
				for (let i = 0; i < files?.length; i++) {
					const file = files.item(i);
					if (file?.size !== undefined) {
						validFiles = [
							...validFiles,
							{
								file: file,
								status: RequestState.NOT_STARTED,
								key: file.name,
								type: file.type,
								fileName: file.name,
							},
						];
					}
				}
			}
			setSelectedFiles(validFiles);
		},
		[setSelectedFiles]
	);

	const removeFileFromSelection = useCallback(
		(fileName: string) => {
			setSelectedFiles((prevState) => {
				const fileToRemoveIndex = prevState.findIndex(
					(file) => file.key === fileName
				);
				const updatedFilesList = [...prevState];
				updatedFilesList.splice(fileToRemoveIndex, 1);
				return updatedFilesList;
			});
		},
		[setSelectedFiles]
	);

	const editFileName = useCallback(
		(fileName: string, selectedFile: FileWithStatus) => {
			const updatedFileList = selectedFiles.map((currentFile) =>
				currentFile.key === selectedFile.key
					? { ...currentFile, fileName }
					: currentFile
			);
			setSelectedFiles(updatedFileList);
		},
		[selectedFiles, setSelectedFiles]
	);

	const onSubmit = useCallback(async () => {
		let params = selectedFiles.map(mapToGenerateUrlParams);
		const response = await generateUploadUrls(params);
		const { urls } = await response.json();

		for (let selectedFile of selectedFiles) {
			const selectedFileUploadUrl = urls.find(
				(url: { key: string }) => url.key === selectedFile.fileName
			);
			setPendingStatus(setSelectedFiles, selectedFile.key);

			uploadFiles(selectedFileUploadUrl?.url, selectedFile.file)
				.then((res) => {
					if (Boolean(res.ok)) {
						setSuccessStatus(setSelectedFiles, selectedFile.key);
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
						createDocument(selectedFile.fileName, user.sub);
					}
				})
				.catch((e) => {
					setErrorStatus(setSelectedFiles, selectedFile.key);
					console.error(e);
				});
		}
	}, [selectedFiles, user?.sub]);

	const areFilesSelected = selectedFiles.length > 0;
	const showUploadButton = useMemo(
		() =>
			selectedFiles.every((file) => file.status === RequestState.NOT_STARTED),
		[selectedFiles]
	);
	const showCloseButton = useMemo(
		() =>
			areFilesSelected &&
			selectedFiles.every(
				(file) =>
					file.status === RequestState.ERROR ||
					file.status === RequestState.SUCCESS
			),
		[selectedFiles, areFilesSelected]
	);

	return (
		<Dialog
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					onClose();
					setSelectedFiles([]);
				}
				setIsDialogOpen(isOpen);
			}}
			open={isDialogOpen}
		>
			<DialogTrigger asChild>
				<Button className="ml-2" onClick={() => setIsDialogOpen(true)}>
					<Upload size={18} className="mr-2" />
					{fileUploadLabels.upload}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{fileUploadLabels.fileUpload}</DialogTitle>
				</DialogHeader>
				{areFilesSelected ? (
					<div className="mt-4">
						{selectedFiles.map((selectedFile) => {
							return (
								<SelectedFileRow
									key={selectedFile.file.name}
									selectedFile={selectedFile}
									editFileName={(fileName) =>
										editFileName(fileName, selectedFile)
									}
									removeFileFromSelection={() =>
										removeFileFromSelection(selectedFile.file.name)
									}
								/>
							);
						})}
					</div>
				) : (
					<p className="m-4 text-center">{fileUploadLabels.noFilesSelected}</p>
				)}
				<div
					className={`flex ${
						showUploadButton ? "justify-between" : "justify-end"
					} `}
				>
					{showUploadButton && <UploadButton onChange={selectFiles} />}
					{areFilesSelected && !showCloseButton && (
						<Button
							onClick={onSubmit}
							disabled={!showCloseButton && !showUploadButton}
						>
							{fileUploadLabels.upload}
						</Button>
					)}
					{showCloseButton && (
						<Button
							onClick={() => {
								onClose();
								setSelectedFiles([]);
								setIsDialogOpen(false);
							}}
						>
							Close
						</Button>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

const mapToGenerateUrlParams = (selectedFile: FileWithStatus) => ({
	bucketName: "docs",
	key: selectedFile.fileName,
	fileType: selectedFile.file.type,
});

export default FileUpload;

//TODO:
// Prevent Save button from jumping when table data is being fetched.

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
			className="flex justify-between p-1"
			onMouseOver={() => setShowEditIcon(true)}
			onMouseOut={() => setShowEditIcon(false)}
		>
			<div
				className="flex w-2/3 h-[32px]"
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
					<div className="self-center truncate" title={updatedFileName}>
						{updatedFileName}
					</div>
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
				{status === RequestState.NOT_STARTED && (
					<X onClick={removeFileFromSelection} size={16} />
				)}
				{status === RequestState.PENDING && (
					<Loader2 className="animate-spin" />
				)}
				{status === RequestState.SUCCESS && <CheckCircle />}
				{status === RequestState.ERROR && <XCircle />}
			</div>
		</div>
	);
};

type SetSelectedFilesState = Dispatch<SetStateAction<FileWithStatus[]>>;

function updateStatus(status: RequestState) {
	return (setState: SetSelectedFilesState, key: string) => {
		setState((prevState) => {
			const updatedFilesList = prevState.map((file) =>
				file.key === key ? { ...file, status } : file
			);
			return updatedFilesList;
		});
	};
}

const setPendingStatus = updateStatus(RequestState.PENDING);
const setSuccessStatus = updateStatus(RequestState.SUCCESS);
const setErrorStatus = updateStatus(RequestState.ERROR);
