import { WorkingEntriesTable } from "@/components/tables/working-entries-table"

export default async function EntriesPage() {
	return (
		<div className="p-6 w-full space-y-4">
			<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
				Attività
			</h2>
			<WorkingEntriesTable />
		</div>
	)
}
