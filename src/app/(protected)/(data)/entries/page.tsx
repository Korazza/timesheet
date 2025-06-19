import { TimesheetCalendar } from "@/components/timesheet-calendar"

export default async function EntriesPage() {
	return (
		<div className="flex h-full flex-col">
			<TimesheetCalendar />
		</div>
	)
}
