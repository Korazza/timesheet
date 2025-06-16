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
import { ChevronLeft, ChevronRight, Pencil, Trash } from "lucide-react"

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
import { useEntries } from "@/hooks/use-entries"
import { getCalendarMatrix } from "@/lib/calendar"
import { EntryWithClient } from "@/db/schema"
import { cn } from "@/lib/utils"
import { useDialog } from "@/hooks/use-dialog"
import { DialogId } from "@/contexts/dialog-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select"

type TimesheetCalendarViewType = "month" | "week" | "day"

interface TimesheetCalendarHeaderProps {
	currentDate: Date
	onDateChange: (date: Date) => void
	viewType: TimesheetCalendarViewType
	onViewTypeChange: (viewType: TimesheetCalendarViewType) => void
}

export function TimesheetCalendarHeader({
	currentDate,
	onDateChange,
	viewType,
	onViewTypeChange,
}: TimesheetCalendarHeaderProps) {
	return (
		<div className="w-full grid grid-rows-2 grid-cols-2 md:grid-rows-1 md:grid-cols-3 px-2 md:place-items-center">
			<Button
				variant="outline"
				className="place-self-start"
				onClick={() => onDateChange(new Date())}
			>
				Oggi
			</Button>
			<div className="flex items-center gap-4">
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
			<React.Fragment>
				<ToggleGroup
					type="single"
					variant="outline"
					value={viewType}
					onValueChange={(val) => {
						if (val) onViewTypeChange(val as TimesheetCalendarViewType)
					}}
					className="hidden place-self-end *:data-[slot=toggle-group-item]:!px-4 md:flex"
				>
					<ToggleGroupItem
						value={"month" as TimesheetCalendarViewType}
						aria-label="Toggle month view type"
					>
						Mese
					</ToggleGroupItem>
					<ToggleGroupItem
						value={"week" as TimesheetCalendarViewType}
						aria-label="Toggle week view type"
					>
						Settimana
					</ToggleGroupItem>
					<ToggleGroupItem
						value={"day" as TimesheetCalendarViewType}
						aria-label="Toggle day view type"
					>
						Giorno
					</ToggleGroupItem>
				</ToggleGroup>
				<Select
					value={viewType}
					onValueChange={(selectedViewType) => {
						onViewTypeChange(selectedViewType as TimesheetCalendarViewType)
					}}
				>
					<SelectTrigger
						className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate md:hidden"
						size="sm"
						aria-label="Select a value"
					>
						<SelectValue placeholder="Ultimi 3 mesi" />
					</SelectTrigger>
					<SelectContent className="rounded-xl">
						<SelectItem
							value={"month" as TimesheetCalendarViewType}
							className="rounded-lg"
						>
							Mese
						</SelectItem>
						<SelectItem
							value={"week" as TimesheetCalendarViewType}
							className="rounded-lg"
						>
							Settimana
						</SelectItem>
						<SelectItem
							value={"day" as TimesheetCalendarViewType}
							className="rounded-lg"
						>
							Giorno
						</SelectItem>
					</SelectContent>
				</Select>
			</React.Fragment>
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
		WORK: "var(--working-entry)",
		PERMIT: "var(--permit-entry)",
		SICK: "var(--sick-entry)",
		HOLIDAY: "var(--holiday-entry)",
	}

	const foregroundColorMap = {
		WORK: "var(--working-entry-foreground)",
		PERMIT: "var(--permit-entry-foreground)",
		SICK: "var(--sick-entry-foreground)",
		HOLIDAY: "var(--holiday-entry-foreground)",
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
				color: foregroundColorMap[entry.type],
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
	const isMobile = useIsMobile()
	const [date, setDate] = React.useState(new Date())
	const [viewType, setViewType] = React.useState<TimesheetCalendarViewType>(
		isMobile ? "week" : "month"
	)
	const days = getCalendarMatrix(date)
	const [selectedEntry, setSelectedEntry] =
		React.useState<EntryWithClient | null>(null)
	const [selectedDate, setSelectedDate] = React.useState<Date>()
	const { entries } = useEntries()
	const { openDialog, closeDialog } = useDialog()

	React.useEffect(() => {
		setViewType(isMobile ? "week" : "month")
	}, [isMobile])

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

	const WEEK_DAYS = React.useMemo(
		() =>
			eachDayOfInterval({
				start: startOfWeek(new Date(), { weekStartsOn: 1 }),
				end: addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 6),
			}).map((date) => format(date, isMobile ? "E" : "EEEE")),
		[isMobile]
	)

	return (
		<div className="flex-1 h-full flex flex-col md:border-2 border-border md:rounded-t-2xl overflow-hidden">
			<div className="py-2">
				<TimesheetCalendarHeader
					currentDate={date}
					onDateChange={setDate}
					viewType={viewType}
					onViewTypeChange={setViewType}
				/>
			</div>
			{viewType === "month" && (
				<React.Fragment>
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
										<div
											className={cn(
												"transition-all flex flex-col border-1 gap-1.5 p-2 bg-card text-card-foreground",
												!isSameMonth(day, date) && "opacity-25"
											)}
										>
											<span
												className={cn(
													"text-sm font-medium max-w-fit ml-auto text-muted-foreground",
													isToday(day) &&
														"bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full shadow-sm"
												)}
											>
												{day.getDate()}
											</span>
											<div className="flex flex-col flex-1 gap-1">
												{dayEntries.map((entry) => (
													<div
														key={entry.id}
														data-entry
														onContextMenu={() => {
															closeDialog()
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
														if (selectedEntry)
															openDialog(getEditDialogId(selectedEntry), {
																entry: selectedEntry,
															})
													}}
												>
													<Pencil />
													Modifica
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
														onClick={() =>
															openDialog("createWorkingEntry", {
																date: selectedDate,
															})
														}
													>
														Attivitá
													</ContextMenuItem>
													<ContextMenuItem
														onClick={() =>
															openDialog("createHolidayEntry", {
																date: selectedDate,
															})
														}
													>
														Ferie
													</ContextMenuItem>
													<ContextMenuItem
														onClick={() =>
															openDialog("createPermitEntry", {
																date: selectedDate,
															})
														}
													>
														Permesso
													</ContextMenuItem>
													<ContextMenuItem
														onClick={() =>
															openDialog("createSickEntry", {
																date: selectedDate,
															})
														}
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
				</React.Fragment>
			)}

			{viewType === "week" && (
				<div className="p-4 text-center text-muted-foreground text-sm">
					🚧 Vista settimanale in sviluppo
				</div>
			)}

			{viewType === "day" && (
				<div className="p-4 text-center text-muted-foreground text-sm">
					🚧 Vista giornaliera in sviluppo
				</div>
			)}
		</div>
	)
}
