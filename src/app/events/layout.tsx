import SearchEventsForm from "@/components/Forms/SearchEventsForm/SearchEventsForm";
import { searchEventsDefaultValues } from "@/data/formData";

function DashboardLayout({ children }: { children: any }) {
	return (
		<div className="grid lg:grid-cols-4">
			<div className="col-span-1 p-4">
				<SearchEventsForm defaultValues={searchEventsDefaultValues} />
			</div>
			<div>{children}</div>
		</div>
	);
}

export default DashboardLayout;
