import { HolidayEntriesTable } from "@/components/tables/holiday-entries-table"

export default async function HolidayPage() {
	return (
		<div className="p-6 w-full space-y-4">
			<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
				Ferie
			</h2>
			<HolidayEntriesTable />
		</div>
	)
}
