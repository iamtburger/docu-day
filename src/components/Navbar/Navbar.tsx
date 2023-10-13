"use client";

import { Button } from "@/components/ShadcnUi/button";
import { apiEndpoints } from "@/requests/urls";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

function Navbar() {
	const { user } = useUser();
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
						<a href={apiEndpoints.LOGOUT} className="">
							Logout
						</a>
					</Button>
				) : (
					<Button>
						<a href={apiEndpoints.LOGIN}>Login</a>
					</Button>
				)}
			</div>
		</nav>
	);
}

export default Navbar;
