import { WorkingEntriesTable } from "@/components/tables/working-entries-table"

export default async function ActivityPage() {
	return (
		<div className="flex h-full flex-col gap-4 py-4 md:p-4">
			<WorkingEntriesTable />
		</div>
	)
}
