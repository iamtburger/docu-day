"use client";

import { Button } from "@/components/ui/button";
import { getSession } from "@auth0/nextjs-auth0";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { debug } from "util";

function Navbar() {
	const { user } = useUser();
	console.log(user);
	return (
		<nav className="flex items-center space-x-4 lg:space-x-6 justify-between h-12 p-4 bg-violet-500">
			<Link href="/" className="flex text-white">
				Home
			</Link>
			<div className="">
				<Link href="/dashboard" className="mr-6 text-white">
					Dashboard
				</Link>
				{Boolean(user) ? (
					<Button>
						<a href="http://localhost:3000/api/auth/logout" className="">
							Logout
						</a>
					</Button>
				) : (
					<Button>
						<a href="http://localhost:3000/api/auth/login">Login</a>
					</Button>
				)}
				{/* <button
					onClick={() => {
						fetch("http://localhost:3000/api/user", {
							method: "POST",
							body: JSON.stringify({
								id: user?.sub || "sid",
								username: user?.name || "user",
							}),
						});
					}}
				>
					Create User
				</button> */}
			</div>
		</nav>
	);
}

export default Navbar;
