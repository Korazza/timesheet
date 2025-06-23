import { HolidayEntriesTable } from "@/tables/holiday-entries-table"

export default async function HolidayPage() {
	return (
		<div className="flex h-full flex-col gap-4 py-4 md:p-4">
			<HolidayEntriesTable />
		</div>
	)
}
