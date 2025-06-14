"use client"

import * as React from "react"
import {
	addMonths,
	format,
	isSameDay,
	isSameMonth,
	isToday,
	subMonths,
	eachDayOfInterval,
	startOfWeek,
	addDays,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { getCalendarMatrix } from "@/lib/calendar"
import { useEntries } from "@/hooks/use-entries"
import { EntryWithClient } from "@/db/schema"
import { cn } from "@/lib/utils"

const WEEK_DAYS = eachDayOfInterval({
	start: startOfWeek(new Date(), { weekStartsOn: 1 }),
	end: addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 6),
}).map((date) => format(date, "EEEE"))

interface TimesheetCalendarHeaderProps {
	currentDate: Date
	onDateChange: (date: Date) => void
}

export function TimesheetCalendarHeader({
	currentDate,
	onDateChange,
}: TimesheetCalendarHeaderProps) {
	return (
		<div className="w-full flex items-center justify-center gap-4">
			<Button
				variant="outline"
				size="icon"
				onClick={() => onDateChange(subMonths(currentDate, 1))}
			>
				<ChevronLeft className="h-5 w-5" />
			</Button>
			<div suppressHydrationWarning className="text-lg font-semibold">
				{format(currentDate, "MMMM yyyy")}
			</div>
			<Button
				variant="outline"
				size="icon"
				onClick={() => onDateChange(addMonths(currentDate, 1))}
			>
				<ChevronRight className="h-5 w-5" />
			</Button>
		</div>
	)
}

interface TimesheetCalendarEntryPillProps {
	entry: EntryWithClient
}

function TimesheetCalendarEntryPill({
	entry,
}: TimesheetCalendarEntryPillProps) {
	const totalHours = entry.hours + (entry.overtimeHours ?? 0)

	const colorMap = {
		WORK: "var(--chart-2)",
		PERMIT: "var(--chart-3)",
		SICK: "var(--chart-4)",
		HOLIDAY: "var(--chart-5)",
	}

	const labelMap = {
		WORK: entry.client?.name ?? "Lavoro",
		HOLIDAY: "Ferie",
		PERMIT: "Permesso",
		SICK: "Malattia",
	}

	const content = (
		<div
			className="text-xs px-2 py-1 rounded text-black font-medium flex items-center  justify-between"
			style={{
				backgroundColor: colorMap[entry.type],
			}}
		>
			<span className="truncate max-w-full">{labelMap[entry.type]}</span>
			<span>{totalHours} h</span>
		</div>
	)

	if (entry.description) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>{content}</TooltipTrigger>
				<TooltipContent className="max-w-[200px] text-sm whitespace-pre-wrap">
					{entry.description}
				</TooltipContent>
			</Tooltip>
		)
	}

	return content
}

export function TimesheetCalendar() {
	const [date, setDate] = React.useState(new Date())
	const days = getCalendarMatrix(date)
	const { entries } = useEntries()

	return (
		<div className="flex-1 h-full flex flex-col border-2 border-border rounded-t-2xl overflow-hidden">
			<div className="py-2">
				<TimesheetCalendarHeader currentDate={date} onDateChange={setDate} />
			</div>
			<div className="grid grid-cols-7">
				{WEEK_DAYS.map((d) => (
					<div
						key={d}
						className="bg-card border-1 py-2 text-sm font-medium text-center text-card-foreground"
						suppressHydrationWarning
					>
						{d}
					</div>
				))}
			</div>
			<div className="flex-1 grid grid-cols-7">
				{days.map((day, dayIndex) => {
					const dayEntries = entries.filter((e) =>
						isSameDay(new Date(e.date), day)
					)

					return (
						<div
							key={dayIndex}
							className={cn(
								"transition-all flex flex-col border-1 gap-1 p-2 bg-card text-card-foreground",
								!isSameMonth(day, date) && "opacity-40"
							)}
						>
							<span
								className={cn(
									"text-sm font-medium max-w-fit ml-auto text-muted-foreground",
									isToday(day) &&
										"bg-primary text-primary-foreground px-1.5 py-1 rounded-full"
								)}
							>
								{day.getDate()}
							</span>
							<div className="flex flex-col flex-1 gap-1">
								{dayEntries.map((entry, entryIndex) => (
									<TimesheetCalendarEntryPill key={entryIndex} entry={entry} />
								))}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
