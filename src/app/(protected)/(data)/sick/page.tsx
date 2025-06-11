import { SickEntriesTable } from "@/components/tables/sick-entries-table"

export default async function SickPage() {
	return (
		<div className="p-6 w-full space-y-4">
			<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
				Malattia
			</h2>
			<SickEntriesTable />
		</div>
	)
}
