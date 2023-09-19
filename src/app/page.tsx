import {
	Button,
	Card,
	CardContent,
	Grid,
	Input,
	Typography,
} from "@mui/material";
import FileUpload from "./components/FileUpload/FileUpload";
import Link from "next/link";
import Image from "next/image";
import ArticleIcon from "@mui/icons-material/Article";
import ImageIcon from "@mui/icons-material/Image";
import NotesIcon from "@mui/icons-material/Notes";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<Button variant="contained" component="span">
				<Link href="api/auth/login">Login</Link>
			</Button>
			<Card sx={{ width: 450 }}>
				<CardContent>
					<FileUpload />
				</CardContent>
			</Card>
		</main>
	);
}
