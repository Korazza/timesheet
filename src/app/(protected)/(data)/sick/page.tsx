import { SickEntriesTable } from "@/components/tables/sick-entries-table"

export default async function SickPage() {
	return (
		<div className="flex flex-col h-full py-4 md:p-4 gap-4">
			<SickEntriesTable />
		</div>
	)
}
