import { Page, PageSection } from "@/components/Page";
import FindStudentForm from "@/components/forms/FindStudentForm";
import { enforceAdmin } from "@/utils/enforcement";
import { User } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";

export const getServerSideProps = enforceAdmin();

export default function FindStudent() {
	const [students, setStudents] = useState<User[]>([]);
	return (
		<Page>
			<PageSection title="Find Student" padded={true}>
				<FindStudentForm onFind={(data: User[]) => setStudents(data)} />
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
					{students.map(student => {
						return (
							<Link
								key={student.id}
								href={`/profile/${student.aeries_id}`}
								className="text-xl underline"
							>
								{student.first_name} {student.last_name}
							</Link>
						);
					})}
				</div>
			</PageSection>
		</Page>
	);
}

