import SearchEventsForm from "@/components/Forms/SearchEventsForm/SearchEventsForm";
import { searchEventsDefaultValues } from "@/data/formData";

function DashboardLayout({ children }: { children: any }) {
	return (
		<div className="grid grid-cols-6">
			<div className="lg:col-span-2 md:col-span-3 col-span-6 p-4">
				<SearchEventsForm defaultValues={searchEventsDefaultValues} />
			</div>
			<div>{children}</div>
		</div>
	);
}

export default DashboardLayout;
