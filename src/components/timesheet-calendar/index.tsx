"use client"

import * as React from "react"
import {
	format,
	isSameDay,
	isSameMonth,
	isToday,
	eachDayOfInterval,
	startOfWeek,
	addDays,
} from "date-fns"
import { Pencil, Trash, Copy, Clipboard } from "lucide-react"
import { useTranslations } from "next-intl"
import { DndContext, DragEndEvent } from "@dnd-kit/core"

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useEntries } from "@/hooks/use-entries"
import { getCalendarMatrix, getDayView, getWeekDays } from "@/lib/calendar"
import { EntryWithClient } from "@/types"
import { cn } from "@/lib/utils"
import { useDialog } from "@/hooks/use-dialog"
import { DialogId } from "@/contexts/dialog-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { addEntry, updateEntry } from "@/actions/entries"
import { entriesTable } from "@/db/schema"
import { toast } from "sonner"
import { TimesheetCalendarHeader } from "./header"
import { TimesheetCalendarCell } from "./cell"
import { TimesheetLegend } from "./legend"

export type TimesheetCalendarViewType = "month" | "week" | "day"

function getInitialDate(): Date {
	const today = new Date()
	const day = today.getDay()
	if (day === 6) return addDays(today, 2)
	if (day === 0) return addDays(today, 1)
	return today
}

function getEditDialogId(entry: EntryWithClient): DialogId {
	switch (entry.type) {
		case "WORK":
			return "editWorkingEntry"
		case "HOLIDAY":
			return "editHolidayEntry"
		case "PERMIT":
			return "editPermitEntry"
		case "SICK":
			return "editSickEntry"
		default:
			throw new Error("Tipo di entry sconosciuto")
	}
}

export function TimesheetCalendar() {
	const t = useTranslations("Calendar")
	const isMobile = useIsMobile()
	const [date, setDate] = React.useState(() => getInitialDate())
	const [viewType, setViewType] =
		React.useState<TimesheetCalendarViewType>("week")
	const days = (
		viewType === "month"
			? getCalendarMatrix(date)
			: viewType === "week"
				? getWeekDays(date)
				: getDayView(date)
	).filter((d) => d.getDay() !== 0 && d.getDay() !== 6)
	const [selectedEntry, setSelectedEntry] =
		React.useState<EntryWithClient | null>(null)
	const [selectedDate, setSelectedDate] = React.useState<Date>()
	const { entries } = useEntries()
	const { openDialog } = useDialog()
	const { setEntries } = useEntries()
	const [copiedEntry, setCopiedEntry] = React.useState<EntryWithClient | null>(
		null
	)

	React.useEffect(() => {
		if (isMobile) {
			setViewType("week")
		}
	}, [isMobile])

	async function handleDragEnd(event: DragEndEvent) {
		if (!(event.over && event.over.data.current && event.active.data.current)) {
			return
		}
		if (!event.over || !event.over.data.current) return

		const entryId = event.active.data.current.entry.id
		const newDate = event.over.data.current.day

		setEntries((prevEntries) => {
			return prevEntries.map((entry) =>
				event.active.data.current &&
				entry.id === event.active.data.current.entry.id
					? {
							...entry,
							date: newDate,
						}
					: entry
			)
		})
		try {
			const updated = await updateEntry({
				...event.active.data.current.entry,
				date: newDate,
			})
			if (updated && updated.date !== newDate) {
				setEntries((prevEntries) =>
					prevEntries.map((entry) =>
						entry.id === entryId ? { ...entry, ...updated } : entry
					)
				)
				toast.success(t("success.moved"))
			}
		} catch (err) {
			setEntries((prevEntries) =>
				prevEntries.map((entry) =>
					entry.id === entryId && event.active.data.current
						? { ...entry, date: event.active.data.current.entry.date }
						: entry
				)
			)
			toast.error(t("error.moved"))
		}
	}

	const handleCopy = React.useCallback(() => {
		if (selectedEntry) setCopiedEntry(selectedEntry)
	}, [selectedEntry])

	const handlePaste = React.useCallback(
		async (targetDate: Date) => {
			if (!copiedEntry) return
			const newEntry: typeof entriesTable.$inferInsert = {
				...copiedEntry,
				id: undefined,
				date: targetDate,
			}
			const createdEntry = await addEntry(newEntry)
			const entryWithClient: EntryWithClient = {
				...(Array.isArray(createdEntry) ? createdEntry[0] : createdEntry),
				client: copiedEntry.client, // always ensure client is present
			}
			setEntries((prev) => {
				const updated = [entryWithClient, ...prev]
				updated.sort(
					(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
				)
				return updated
			})
			toast.success(t("success.pasted"))
		},
		[copiedEntry, setEntries, t]
	)

	const WEEK_DAYS = React.useMemo(() => {
		const weekDaysRaw =
			viewType === "day"
				? [
						{
							label: format(date, "EEEE"),
							date,
						},
					]
				: eachDayOfInterval({
						start: startOfWeek(date, { weekStartsOn: 1 }),
						end: addDays(startOfWeek(date, { weekStartsOn: 1 }), 6),
					}).map((date) => ({
						label: format(date, isMobile ? "E" : "EEEE"),
						date,
					}))

		return weekDaysRaw
			.filter((d) => d.date.getDay() !== 0 && d.date.getDay() !== 6)
			.map((d) => d.label)
	}, [isMobile, viewType, date])

	return (
		<div className="border-border flex h-full flex-1 flex-col overflow-hidden md:border md:shadow-md">
			<div className="flex items-center justify-between p-2">
				<TimesheetCalendarHeader
					currentDate={date}
					onDateChange={setDate}
					viewType={viewType}
					onViewTypeChange={setViewType}
				/>
			</div>
			{viewType !== "day" && (
				<div className="grid grid-cols-5">
					{viewType === "week"
						? getWeekDays(date)
								.filter((d) => d.getDay() !== 0 && d.getDay() !== 6)
								.map((d) => (
									<div
										key={d.toISOString()}
										className="bg-card text-card-foreground flex items-center justify-center gap-4 border-1 py-2 text-center text-sm font-medium"
										suppressHydrationWarning
									>
										<span>{format(d, isMobile ? "E" : "EEEE")}</span>
										<span
											className={cn(
												"text-muted-foreground font-bold",
												isToday(d) && "text-primary"
											)}
										>
											{d.getDate()}
										</span>
									</div>
								))
						: WEEK_DAYS.map((d) => (
								<div
									key={d}
									className="bg-card text-card-foreground border-1 py-2 text-center text-sm font-medium"
									suppressHydrationWarning
								>
									{d}
								</div>
							))}
				</div>
			)}
			<DndContext onDragEnd={handleDragEnd}>
				<div
					className={cn(
						"grid flex-1",
						(viewType === "month" || viewType === "week") && "grid-cols-5",
						viewType === "day" && "grid-cols-1"
					)}
				>
					{days.map((day) => {
						const dayEntries = entries.filter((e) =>
							isSameDay(new Date(e.date), day)
						)
						const isDisabled =
							(viewType === "month" && !isSameMonth(day, date)) ||
							day.getDay() === 0 ||
							day.getDay() === 6

						return (
							<ContextMenu key={day.toISOString()}>
								<ContextMenuTrigger
									asChild
									onContextMenu={(e) => {
										const isEntry = (e.target as HTMLElement).closest(
											"[data-entry]"
										)
										if (!isEntry) {
											setSelectedDate(day)
											setSelectedEntry(null)
										}
									}}
								>
									<TimesheetCalendarCell
										viewType={viewType}
										calendarDate={date}
										day={day}
										dayEntries={dayEntries}
										setSelectedDate={setSelectedDate}
										setSelectedEntry={setSelectedEntry}
									/>
								</ContextMenuTrigger>
								<ContextMenuContent>
									{selectedEntry ? (
										<React.Fragment>
											<ContextMenuItem
												onClick={() => {
													if (selectedEntry)
														openDialog(getEditDialogId(selectedEntry), {
															entry: selectedEntry,
														})
												}}
											>
												<Pencil />
												{t("edit")}
											</ContextMenuItem>
											<ContextMenuItem onClick={handleCopy}>
												<Copy />
												{t("copy")}
											</ContextMenuItem>
											<ContextMenuItem
												variant="destructive"
												onClick={() => {
													if (selectedEntry)
														openDialog("confirmDeleteEntry", {
															entry: selectedEntry,
														})
												}}
											>
												<Trash />
												{t("delete")}
											</ContextMenuItem>
										</React.Fragment>
									) : (
										<React.Fragment>
											<ContextMenuSub>
												<ContextMenuSubTrigger inset>
													{t("add")}
												</ContextMenuSubTrigger>
												<ContextMenuSubContent className="w-44">
													<ContextMenuItem
														onClick={() =>
															openDialog("createWorkingEntry", {
																date: selectedDate,
															})
														}
													>
														{t("activity")}
													</ContextMenuItem>
													<ContextMenuItem
														onClick={() =>
															openDialog("createHolidayEntry", {
																date: selectedDate,
															})
														}
													>
														{t("holiday")}
													</ContextMenuItem>
													<ContextMenuItem
														onClick={() =>
															openDialog("createPermitEntry", {
																date: selectedDate,
															})
														}
													>
														{t("permit")}
													</ContextMenuItem>
													<ContextMenuItem
														onClick={() =>
															openDialog("createSickEntry", {
																date: selectedDate,
															})
														}
													>
														{t("sick")}
													</ContextMenuItem>
												</ContextMenuSubContent>
											</ContextMenuSub>
											{copiedEntry && selectedDate && !isDisabled && (
												<ContextMenuItem onClick={() => handlePaste(day)}>
													<Clipboard />
													{t("paste")}
												</ContextMenuItem>
											)}
										</React.Fragment>
									)}
								</ContextMenuContent>
							</ContextMenu>
						)
					})}
				</div>
			</DndContext>
			<TimesheetLegend />
		</div>
	)
}
