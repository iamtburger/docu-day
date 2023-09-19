"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
	Typography,
	Button,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";
import ErrorIcon from "@mui/icons-material/Error";

import "./FileUpload.css";

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

// interface SelectedFiles {
// 	[key: string]: FileWithStatus;
// }

type SelectedFiles = FileWithStatus[];

const FileUpload = () => {
	const [selectedFiles, setSelectedFiles] = useState<FileWithStatus[]>([]);

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

	const removeFileFromSelection = (fileName: string) => {};

	const areFilesSelected = Object.keys(selectedFiles).length > 0;

	return (
		<Dialog open={true} fullWidth maxWidth="sm">
			<DialogTitle align="center">File upload</DialogTitle>
			<DialogContent>
				{areFilesSelected ? (
					<Box m={4}>
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
					</Box>
				) : (
					<Typography align="center" m={4}>
						No files selected
					</Typography>
				)}
				<Box display="flex" justifyContent="space-between">
					<label htmlFor="contained-button-file">
						<input
							id="contained-button-file"
							type="file"
							onChange={(e) => selectFiles(e.currentTarget.files)}
							multiple
							hidden
						/>
						<Button variant="contained" component="span">
							Browse...
						</Button>
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
				</Box>
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
				style={{ display: "flex", height: "32px", fontFamily: "inherit" }}
				onBlur={() => {
					editFileName(updatedFileName);
					setIsFileNameEditable(false);
				}}
			>
				{isFileNameEditable ? (
					<TextField
						variant="standard"
						value={updatedFileName}
						onChange={(e) => setUpdatedFileName(e.target.value)}
						autoFocus
					/>
				) : (
					<div>{updatedFileName}</div>
				)}
				{showEditIcon && (
					<EditIcon
						onClick={() => setIsFileNameEditable((prevState) => !prevState)}
					/>
				)}
			</div>
			{status === FileUploadStatus.NOT_STARTED && (
				<ClearIcon onClick={removeFileFromSelection} />
			)}
			{status === FileUploadStatus.PENDING && <CircularProgress size={30} />}
			{status === FileUploadStatus.SUCCESS && <CheckCircleIcon />}
			{status === FileUploadStatus.ERROR && <ErrorIcon />}
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
