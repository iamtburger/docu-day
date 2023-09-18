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
	fileName?: string;
	status?: FileUploadStatus;
	fileUploadUrl?: any;
	key: string;
	type: string;
}

interface SelectedFiles {
	[key: string]: FileWithStatus;
}

const FileUpload = () => {
	const [selectedFiles, setSelectedFiles] = useState<{
		[key: string]: FileWithStatus;
	}>({});

	const selectFiles = (files: FileList | null) => {
		let validFiles: SelectedFiles = {};
		if (files?.length !== undefined) {
			for (let i = 0; i < files?.length; i++) {
				const file = files.item(i);
				if (file?.size !== undefined) {
					validFiles = {
						...validFiles,
						[file.name]: {
							file: file,
							status: FileUploadStatus.NOT_STARTED,
							key: file.name,
							type: file.type,
						},
					};
				}
			}
		}
		setSelectedFiles(validFiles);
	};

	const removeFileFromSelection = (fileName: string) => {
		let { [fileName]: undefined, ...rest } = selectedFiles;
		setSelectedFiles(rest);
	};

	const areFilesSelected = Object.keys(selectedFiles).length > 0;

	return (
		<Dialog open={true} fullWidth maxWidth="sm">
			<DialogTitle align="center">File upload</DialogTitle>
			<DialogContent>
				{areFilesSelected ? (
					<Box m={4}>
						{Object.values(selectedFiles).map((selectedFile) => {
							return (
								<SelectedFileRow
									key={selectedFile.file.name}
									selectedFile={selectedFile}
									editFileName={(fileName) => {
										setSelectedFiles((prevState) => ({
											...prevState,
											[selectedFile.file.name]: {
												...selectedFile,
												key: fileName,
											},
										}));
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
								let params = Object.values(selectedFiles).map(
									(selectedFile) => ({
										bucketName: "docs",
										key: selectedFile.key,
										fileType: selectedFile.file.type,
									})
								);

								const response = await fetch(
									"http://localhost:3000/api/generate",
									{
										method: "POST",
										body: JSON.stringify({ params }),
									}
								);
								const { urls } = await response.json();

								for (let selectedFileKey in selectedFiles) {
									const selectedFile = selectedFiles[selectedFileKey];
									const selectedFileUploadUrl = urls.find(
										(url: { key: string }) => url.key === selectedFile.key
									);
									setPendingStatus(
										setSelectedFiles,
										selectedFiles,
										selectedFileKey
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
													selectedFileKey
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
												selectedFileKey
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
				onBlur={() => setIsFileNameEditable(false)}
			>
				{isFileNameEditable ? (
					<TextField
						variant="standard"
						value={selectedFile.key}
						onChange={(e) => editFileName(e.target.value)}
						autoFocus
					/>
				) : (
					<div>{selectedFile.key}</div>
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

type SetSelectedFilesState = Dispatch<
	SetStateAction<{
		[key: string]: FileWithStatus;
	}>
>;

function updateStatus(status: FileUploadStatus) {
	return (
		setState: SetSelectedFilesState,
		files: SelectedFiles,
		key: string
	) => {
		setState((prevState: SelectedFiles) => ({
			...prevState,
			[key]: {
				...files[key],
				status,
			},
		}));
	};
}

const setPendingStatus = updateStatus(FileUploadStatus.PENDING);
const setSuccessStatus = updateStatus(FileUploadStatus.SUCCESS);
const setErrorStatus = updateStatus(FileUploadStatus.ERROR);
