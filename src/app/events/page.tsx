import { getSession } from "@auth0/nextjs-auth0";
import { useUser } from "@auth0/nextjs-auth0/client";
import { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";

const Dashboard: NextPage = () => {
	return (
		<div>
			<div>THIS IS A DASHBOARD</div>;
		</div>
	);
};

export default Dashboard;
