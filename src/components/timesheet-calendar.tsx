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
	isWeekend,
	endOfWeek,
} from "date-fns"
import {
	ChevronLeft,
	ChevronRight,
	FileSpreadsheet,
	Pencil,
	Trash,
} from "lucide-react"
import * as XLSX from "xlsx"

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
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useEntries } from "@/hooks/use-entries"
import { getCalendarMatrix, getDayView, getWeekDays } from "@/lib/calendar"
import { EntryWithClient } from "@/db/schema"
import { cn } from "@/lib/utils"
import { useDialog } from "@/hooks/use-dialog"
import { DialogId } from "@/contexts/dialog-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { useEnumOptions } from "@/enums"
import { useTranslations } from "next-intl"

type TimesheetCalendarViewType = "month" | "week" | "day"

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
	const [viewType, setViewType] = React.useState<TimesheetCalendarViewType>(
		isMobile ? "week" : "month"
	)
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
	const { openDialog, closeDialog } = useDialog()
	const { entryTypeOptions, activityTypeOptions } = useEnumOptions()

	React.useEffect(() => {
		if (isMobile) {
			setViewType("week")
		}
	}, [isMobile])

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

	const handleExportExcel = React.useCallback(() => {
		if (!entries || entries.length === 0) return
		const data = entries.map((entry) => ({
			Data: format(new Date(entry.date), "dd/MM/yyyy"),
			Tipo:
				entryTypeOptions.find((eto) => eto.value === entry.type)?.label || "",
			Tipologia:
				activityTypeOptions.find((ato) => ato.value === entry.activityType)
					?.label || "",
			Cliente: entry.client?.name || "",
			Descrizione: entry.description || "",
			Ore: entry.hours,
			"Ore Straordinarie": entry.overtimeHours || 0,
		}))
		const worksheet = XLSX.utils.json_to_sheet(data, { cellDates: true })

		worksheet["!cols"] = [
			{ wch: 14 },
			{ wch: 12 },
			{ wch: 16 },
			{ wch: 22 },
			{ wch: 60 },
			{ wch: 10 },
			{ wch: 18 },
		]

		const range = XLSX.utils.decode_range(worksheet["!ref"]!)
		for (let R = range.s.r + 1; R <= range.e.r; ++R) {
			const cellOre = worksheet[XLSX.utils.encode_cell({ c: 5, r: R })]
			if (cellOre) {
				cellOre.t = "n"
				cellOre.z = "0.00"
			}
			const cellStraord = worksheet[XLSX.utils.encode_cell({ c: 6, r: R })]
			if (cellStraord) {
				cellStraord.t = "n"
				cellStraord.z = "0.00"
			}
		}

		if (worksheet["!ref"]) {
			worksheet["!autofilter"] = { ref: worksheet["!ref"] as string }
		}

		const workbook = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(workbook, worksheet, "Consuntivazioni")
		XLSX.writeFile(
			workbook,
			`Consuntivazioni_${format(new Date(), "dd-MM-yyyy_HH-mm-ss")}.xlsx`
		)
	}, [entries])

	return (
		<div className="flex-1 h-full flex flex-col md:border border-border md:rounded-2xl overflow-hidden md:shadow-md">
			<div className="flex items-center justify-between p-2">
				<TimesheetCalendarHeader
					currentDate={date}
					onDateChange={setDate}
					viewType={viewType}
					onViewTypeChange={setViewType}
				/>
				<Button
					className="hidden lg:inline-flex"
					variant="outline"
					onClick={handleExportExcel}
					title={t("exportExcel")}
				>
					<FileSpreadsheet className="w-4 h-4" />
					<span className="hidden xl:inline">{t("exportExcel")}</span>
				</Button>
			</div>
			{viewType !== "day" && (
				<div className="grid grid-cols-5">
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
			)}
			<div
				className={cn(
					"flex-1 grid",
					(viewType === "month" || viewType === "week") && "grid-cols-5",
					viewType === "day" && "grid-cols-1"
				)}
			>
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
										"transition-all flex flex-col border gap-1.5 p-2 bg-card text-card-foreground",
										!isSameMonth(day, date) && "opacity-25",
										isToday(day) && "border-primary rounded-sm shadow-xs",
										viewType === "week" && "gap-4",
										viewType === "day" && "p-4 gap-6"
									)}
								>
									{viewType !== "day" && (
										<span
											className={cn(
												"font-medium max-w-fit ml-auto text-muted-foreground",
												isToday(day) &&
													"bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full shadow",
												viewType === "month" && "text-sm"
											)}
										>
											{day.getDate()}
										</span>
									)}

									{viewType === "day" && dayEntries.length === 0 ? (
										<div className="flex-1 flex items-center justify-center text-muted-foreground">
											<span className="text-lg lg:text-xl">
												{t("noEntries")}
											</span>
										</div>
									) : (
										<div
											className={cn(
												"flex flex-col flex-1 gap-1 md:gap-1.5",
												viewType === "week" && "gap-2.5 md:gap-6",
												viewType === "day" &&
													"gap-4 md:gap-6 lg:gap-8 lg:items-center lg:justify-center"
											)}
										>
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
													<TimesheetCalendarEntryPill
														entry={entry}
														viewType={viewType}
													/>
												</div>
											))}
										</div>
									)}
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
											{t("edit")}
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
								) : selectedDate ? (
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
								) : null}
							</ContextMenuContent>
						</ContextMenu>
					)
				})}
			</div>
			<TimesheetLegend />
		</div>
	)
}

interface TimesheetCalendarHeaderProps {
	currentDate: Date
	onDateChange: (date: Date) => void
	viewType: TimesheetCalendarViewType
	onViewTypeChange: (viewType: TimesheetCalendarViewType) => void
}

function TimesheetCalendarHeader({
	currentDate,
	onDateChange,
	viewType,
	onViewTypeChange,
}: TimesheetCalendarHeaderProps) {
	const t = useTranslations("Calendar")
	function getNextValidDate(date: Date): Date {
		let next = addDays(date, 1)
		while (isWeekend(next)) {
			next = addDays(next, 1)
		}
		return next
	}

	function getPrevValidDate(date: Date): Date {
		let prev = addDays(date, -1)
		while (isWeekend(prev)) {
			prev = addDays(prev, -1)
		}
		return prev
	}

	return (
		<div className="w-full grid grid-cols-2 md:grid-cols-3 px-2 place-items-center">
			<Button
				variant="outline"
				className="hidden place-self-start md:block"
				title={t("today")}
				onClick={() => {
					const today = new Date()
					onDateChange(
						viewType === "day" && isWeekend(today)
							? getNextValidDate(today)
							: today
					)
				}}
			>
				{t("today")}
			</Button>
			<div className="flex items-center gap-4">
				<Button
					variant="outline"
					size="icon"
					title={t("previous")}
					onClick={() => {
						if (viewType === "month") {
							onDateChange(subMonths(currentDate, 1))
						} else if (viewType === "week") {
							onDateChange(addDays(currentDate, -7))
						} else {
							onDateChange(getPrevValidDate(currentDate))
						}
					}}
				>
					<ChevronLeft className="h-5 w-5" />
				</Button>
				<div suppressHydrationWarning className="text-lg font-semibold">
					{viewType === "month" ? (
						format(currentDate, "MMMM yyyy")
					) : viewType === "week" ? (
						<>
							{format(startOfWeek(currentDate, { weekStartsOn: 1 }), "dd MMM")}{" "}
							–{" "}
							{format(
								endOfWeek(currentDate, { weekStartsOn: 6 }),
								"dd MMM yyyy"
							)}
						</>
					) : (
						format(currentDate, "dd MMMM yyyy")
					)}
				</div>
				<Button
					variant="outline"
					size="icon"
					title={t("next")}
					onClick={() => {
						if (viewType === "month") {
							onDateChange(addMonths(currentDate, 1))
						} else if (viewType === "week") {
							onDateChange(addDays(currentDate, 7))
						} else {
							onDateChange(getNextValidDate(currentDate))
						}
					}}
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
						{t("month")}
					</ToggleGroupItem>
					<ToggleGroupItem
						value={"week" as TimesheetCalendarViewType}
						aria-label="Toggle week view type"
					>
						{t("week")}
					</ToggleGroupItem>
					<ToggleGroupItem
						value={"day" as TimesheetCalendarViewType}
						aria-label="Toggle day view type"
					>
						{t("day")}
					</ToggleGroupItem>
				</ToggleGroup>
				<Select
					value={viewType}
					onValueChange={(selectedViewType) => {
						onViewTypeChange(selectedViewType as TimesheetCalendarViewType)
					}}
				>
					<SelectTrigger
						className="flex justify-self-end w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate md:hidden"
						size="sm"
						aria-label="Select a value"
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent className="rounded-xl">
						<SelectItem
							value={"month" as TimesheetCalendarViewType}
							className="rounded-lg"
						>
							{t("month")}
						</SelectItem>
						<SelectItem
							value={"week" as TimesheetCalendarViewType}
							className="rounded-lg"
						>
							{t("week")}
						</SelectItem>
						<SelectItem
							value={"day" as TimesheetCalendarViewType}
							className="rounded-lg"
						>
							{t("day")}
						</SelectItem>
					</SelectContent>
				</Select>
			</React.Fragment>
		</div>
	)
}

interface TimesheetCalendarEntryPillProps {
	entry: EntryWithClient
	viewType: TimesheetCalendarViewType
}

function TimesheetCalendarEntryPill({
	entry,
	viewType,
}: TimesheetCalendarEntryPillProps) {
	const t = useTranslations("Calendar")
	const isMobile = useIsMobile()
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
		WORK: entry.client?.name ?? t("activity"),
		HOLIDAY: t("holiday"),
		PERMIT: t("permit"),
		SICK: t("sick"),
	}

	const content = (
		<div
			className="rounded px-2.5 py-1 md:px-3 md:py-2 transition-shadow shadow hover:shadow-xl"
			style={{
				backgroundColor: colorMap[entry.type],
				color: foregroundColorMap[entry.type],
			}}
		>
			<div
				className={cn(
					"flex flex-col gap-1",
					"md:flex-row md:items-center md:justify-between"
				)}
			>
				<div className="text-xs md:text-sm font-semibold truncate max-w-full">
					{labelMap[entry.type]}
				</div>
				<div className="text-sm md:text-base font-bold">
					{totalHours} h
					{entry.overtimeHours && (
						<span className="ml-1 text-xs font-medium opacity-80">
							(+ {entry.overtimeHours} h)
						</span>
					)}
				</div>
			</div>

			{(viewType === "day" || !isMobile) && entry.description && (
				<div className="text-xs mt-1 font-medium opacity-80 line-clamp-2 max-w-full break-words">
					{entry.description}
				</div>
			)}
		</div>
	)

	if (entry.description && isMobile && viewType !== "day") {
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

function TimesheetLegend() {
	const t = useTranslations("Calendar")
	const legendItems = [
		{
			label: t("activity"),
			color: "var(--working-entry)",
		},
		{
			label: t("holiday"),
			color: "var(--holiday-entry)",
		},
		{
			label: t("permit"),
			color: "var(--permit-entry)",
		},
		{
			label: t("sick"),
			color: "var(--sick-entry)",
		},
	]

	return (
		<div className="flex flex-wrap gap-2.5 md:gap-4 lg:gap-8 xl:gap-10 px-4 md:w-full justify-center py-2 bg-muted/50 border-t">
			{legendItems.map((item) => (
				<div
					key={item.label}
					className="flex items-center gap-1 md:gap-2 text-xs md:text-sm"
				>
					<span
						className="w-4 h-4 rounded shadow"
						style={{ backgroundColor: item.color }}
					/>
					<span className="text-card-foreground">{item.label}</span>
				</div>
			))}
		</div>
	)
}
