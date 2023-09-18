import { Button, Card, CardContent, Input, Typography } from "@mui/material";
import FileUpload from "./components/FileUpload/FileUpload";
import Link from "next/link";

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
