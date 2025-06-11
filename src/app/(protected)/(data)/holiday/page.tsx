import { HolidayEntriesTable } from "@/components/tables/holiday-entries-table"

export default async function HolidayPage() {
	return (
		<div className="p-4 w-full">
			<HolidayEntriesTable />
		</div>
	)
}
