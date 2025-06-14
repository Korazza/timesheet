import { TimesheetCalendar } from "@/components/timesheet-calendar"

export default async function EntriesPage() {
	return (
		<div className="flex flex-col h-full md:p-4">
			<TimesheetCalendar />
		</div>
	)
}
