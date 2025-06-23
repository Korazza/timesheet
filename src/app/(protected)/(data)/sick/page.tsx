import { SickEntriesTable } from "@/tables/sick-entries-table"

export default async function SickPage() {
	return (
		<div className="flex h-full flex-col gap-4 py-4 md:p-4">
			<SickEntriesTable />
		</div>
	)
}
