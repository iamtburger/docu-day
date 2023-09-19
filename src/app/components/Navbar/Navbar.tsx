import { getSession } from "@auth0/nextjs-auth0";

async function Navbar() {
	const session = await getSession();
	return <nav></nav>;
}

export default Navbar;
