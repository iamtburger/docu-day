function DashboardLayout({ children }: { children: any }) {
	return (
		<div className="flex">
			<div>SIDEBAR</div>
			<div>{children}</div>
		</div>
	);
}

export default DashboardLayout;
