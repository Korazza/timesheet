import { SickEntriesTable } from "@/components/tables/sick-entries-table"

export default async function SickPage() {
	return (
		<div className="flex flex-col h-full p-4 gap-4">
			<SickEntriesTable />
		</div>
	)
}
