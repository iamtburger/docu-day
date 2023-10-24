"user client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";

import {
	Dialog,
	DialogTrigger,
	Button,
	DialogHeader,
	Input,
	DialogContent,
} from "@/components";
import { createCategory } from "@/requests";
import { useToast } from "../ShadcnUi/use-toast";

const CreateCategory = () => {
	const [category, setCategory] = useState("");
	const { toast } = useToast();
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="self-center ml-2">
					<PlusCircle size={18} className="mr-2" />
					Create category
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>Create new category</DialogHeader>
				<Input
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					placeholder="car, phone, health"
				/>
				<Button
					onClick={async () => {
						try {
							const response = await createCategory(category);
							if (Boolean(response.ok)) {
								toast({
									title: "Category created",
								});
								setCategory("");
							}
						} catch (e) {
							console.error(e);
							toast({
								title: "Something went wrong",
							});
						}
					}}
				>
					Save
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default CreateCategory;
