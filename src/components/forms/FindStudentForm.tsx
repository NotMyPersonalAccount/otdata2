import { FindUserInput } from "@/lib/api/routers/user";
import { trpc } from "@/lib/api/trpc";
import { User } from "@prisma/client";
import Form from "./Form";
import FormInput from "./FormInput";
import FormMultiCheckbox from "./FormMultiCheckbox";
import { useEffect, useState } from "react";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/lib/api/routers/_app";
import Spinner from "../Spinner";

type Props = {
	onFind?: (data: User[]) => void;
};

export const queryOptionsAvailable = {
	aeries_gender: "Gender",
	aeries_ethnicity: "Ethnicity",
	cohort: "Cohort",
	grade: "Grade"
};

export default function FindStudentForm({ onFind }: Props) {
	const [queryEnabled, setQueryEnabled] = useState(false);
	const [queryOptions, setQueryOptions] =
		useState<inferRouterOutputs<AppRouter>["user"]["getQueryOptions"]>();
	useEffect(() => {
		if (queryEnabled && !queryOptions)
			(async () => {
				setQueryOptions(await trpc.user.getQueryOptions.query({}));
			})();
	}, [queryEnabled, queryOptions]);

	const queryVisible = queryEnabled && queryOptions;

	return (
		<Form
			onSubmit={async (data: FindUserInput) => {
				const result = await trpc.user.find.query(data);
				onFind?.(result);
			}}
			submitLabel="Search"
		>
			<FormInput name="first_name" label="First Name" />
			<FormInput name="last_name" label="Last Name" />
			<FormInput name="aeries_id" label="Aeries ID" />
			<div className="md:col-span-2 lg:col-span-3 xl:col-span-4 flex gap-2">
				<span className="text-xl font-bold">Enable Advanced Query</span>
				<input
					type="checkbox"
					onChange={e => setQueryEnabled(e.target.checked)}
				/>
			</div>
			{queryVisible
				? Object.entries(queryOptionsAvailable).map(([key, label]) => {
						return (
							<FormMultiCheckbox
								key={key}
								name={key}
								label={label}
								choices={queryOptions?.[key]! ?? []}
							/>
						);
				  })
				: queryEnabled && (
						<div className="w-8 h-8">
							<Spinner />
						</div>
				  )}
		</Form>
	);
}

