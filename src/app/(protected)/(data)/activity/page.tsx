import { WorkingEntriesTable } from "@/components/tables/working-entries-table"

export default async function ActivityPage() {
	return (
		<div className="flex flex-col h-full p-4 gap-4">
			<WorkingEntriesTable />
		</div>
	)
}
