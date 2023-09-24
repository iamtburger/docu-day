import FileUpload from "../components/FileUpload/FileUpload";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar/Navbar";
import prisma from "@/prisma/prisma";

export default function Home() {
	return (
		<main className="flex h-[calc(100vh-48px)] flex-col items-center justify-between lg:p-24 sm:pt-12 bg-gradient-to-b from-black to-violet-500">
			{/* 
					<FileUpload />
			*/}

			<div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-3">
				<div className="col-span-2 min-h-[45vh] relative">
					<Image
						src="undraw_online_calendar.svg"
						alt="managing calendar illustration"
						fill
						className="object-contain"
						priority
					/>
				</div>
				<div></div>
				<div className="text-white">
					<p>This is a content for the application.</p>
				</div>
			</div>
		</main>
	);
}
