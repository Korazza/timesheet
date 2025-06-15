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
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { HolidayEntryCreateDialog } from "@/components/dialogs/holiday-entry-create-dialog"
import { HolidayEntryEditDialog } from "@/components/dialogs/holiday-entry-edit-dialog"
import { PermitEntryCreateDialog } from "@/components/dialogs/permit-entry-create-dialog"
import { PermitEntryEditDialog } from "@/components/dialogs/permit-entry-edit-dialog"
import { SickEntryCreateDialog } from "@/components/dialogs/sick-entry-create-dialog"
import { SickEntryEditDialog } from "@/components/dialogs/sick-entry-edit-dialog"
import { WorkingEntryCreateDialog } from "@/components/dialogs/working-entry-create-dialog"
import { WorkingEntryEditDialog } from "@/components/dialogs/working-entry-edit-dialog"
import { useEntries } from "@/hooks/use-entries"
import { getCalendarMatrix } from "@/lib/calendar"
import { EntryWithClient } from "@/db/schema"
import { cn } from "@/lib/utils"
import { useDialog } from "@/hooks/use-dialog"
import { DialogId } from "@/contexts/dialog-context"

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
	const [selectedEntry, setSelectedEntry] =
		React.useState<EntryWithClient | null>(null)
	const [selectedDate, setSelectedDate] = React.useState<Date>()
	const { entries } = useEntries()
	const { openDialog } = useDialog()

	return (
		<React.Fragment>
			<HolidayEntryCreateDialog date={selectedDate} />
			<HolidayEntryEditDialog entry={selectedEntry} />
			<PermitEntryCreateDialog date={selectedDate} />
			<PermitEntryEditDialog entry={selectedEntry} />
			<SickEntryCreateDialog date={selectedDate} />
			<SickEntryEditDialog entry={selectedEntry} />
			<WorkingEntryCreateDialog date={selectedDate} />
			<WorkingEntryEditDialog entry={selectedEntry} />
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
					{days.map((day) => {
						const dayEntries = entries.filter((e) =>
							isSameDay(new Date(e.date), day)
						)

						return (
							<ContextMenu key={day.toISOString()}>
								<ContextMenuTrigger
									asChild
									onContextMenu={() => {
										debugger
										setSelectedDate(day)
										setSelectedEntry(null)
									}}
								>
									<div
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
											{dayEntries.map((entry) => (
												<div
													key={entry.id}
													onContextMenu={() => {
														setSelectedEntry(entry)
														setSelectedDate(undefined)
													}}
												>
													<TimesheetCalendarEntryPill entry={entry} />
												</div>
											))}
										</div>
									</div>
								</ContextMenuTrigger>
								<ContextMenuContent>
									{selectedEntry ? (
										<React.Fragment>
											<ContextMenuItem
												onClick={() => {
													debugger
													openDialog(
														{
															WORK: "editWorkingEntry",
															HOLIDAY: "editHolidayEntry",
															PERMIT: "editPermitEntry",
															SICK: "editSickEntry",
														}[selectedEntry.type] as DialogId
													)
												}}
											>
												Modifica
											</ContextMenuItem>
											<ContextMenuItem
												variant="destructive"
												onClick={() => console.log("Elimina")}
											>
												Elimina
											</ContextMenuItem>
										</React.Fragment>
									) : selectedDate ? (
										<ContextMenuSub>
											<ContextMenuSubTrigger inset>
												Aggiungi
											</ContextMenuSubTrigger>
											<ContextMenuSubContent className="w-44">
												<ContextMenuItem
													onClick={() => openDialog("createWorkingEntry")}
												>
													Attivitá
												</ContextMenuItem>
												<ContextMenuItem
													onClick={() => openDialog("createHolidayEntry")}
												>
													Ferie
												</ContextMenuItem>
												<ContextMenuItem
													onClick={() => openDialog("createPermitEntry")}
												>
													Permesso
												</ContextMenuItem>
												<ContextMenuItem
													onClick={() => openDialog("createSickEntry")}
												>
													Malattia
												</ContextMenuItem>
											</ContextMenuSubContent>
										</ContextMenuSub>
									) : null}
								</ContextMenuContent>
							</ContextMenu>
						)
					})}
				</div>
			</div>
		</React.Fragment>
	)
}
