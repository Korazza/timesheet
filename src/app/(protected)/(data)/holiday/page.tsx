import { HolidayEntriesTable } from "@/components/tables/holiday-entries-table"

export default async function HolidayPage() {
	return (
		<div className="flex flex-col h-full p-4 gap-4">
			<HolidayEntriesTable />
		</div>
	)
}
