import { TimesheetCalendar } from "@/components/timesheet-calendar"

export default async function EntriesPage() {
	return (
		<div className="flex flex-col h-full py-4 md:p-4 gap-4">
			<TimesheetCalendar />
		</div>
	)
}
