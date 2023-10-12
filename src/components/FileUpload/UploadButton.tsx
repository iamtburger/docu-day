import { fileUploadLabels } from "@/data/labels";

const UploadButton = ({
	onChange,
}: {
	onChange: (files: FileList | null) => void;
}) => {
	return (
		<>
			<input
				id="contained-button-file"
				type="file"
				onChange={(e) => onChange(e.currentTarget.files)}
				multiple
				hidden
			/>
			<label
				htmlFor="contained-button-file"
				className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
			>
				{fileUploadLabels.browse}
			</label>
		</>
	);
};

export default UploadButton;
