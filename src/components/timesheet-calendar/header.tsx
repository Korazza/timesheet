"use client"

import * as React from "react"
import {
	addDays,
	isWeekend,
	subMonths,
	startOfWeek,
	endOfWeek,
	addMonths,
	format,
} from "date-fns"
import {
	ChevronLeft,
	Calendar as CalendarIcon,
	ChevronRight,
} from "lucide-react"
import { useTranslations } from "next-intl"

import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover"
import {
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
	Select,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { TimesheetCalendarViewType } from "."

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
		<div className="flex w-full flex-col gap-3 px-2 md:grid md:grid-cols-3 md:place-items-center md:gap-0">
			<Button
				variant="outline"
				className="self-center md:place-self-start"
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
			<div className="flex items-center justify-center gap-2">
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
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outline" className="flex items-center gap-2">
							<CalendarIcon className="h-5 w-5" />
							{viewType === "month"
								? format(currentDate, "MMMM yyyy")
								: viewType === "week"
									? `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "dd")}-${format(endOfWeek(currentDate, { weekStartsOn: 6 }), "dd MMMM yyyy")}`
									: format(currentDate, "dd MMMM yyyy")}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={currentDate}
							onSelect={(date) => date && onDateChange(date)}
							disabled={(date) => date.getDay() === 0 || date.getDay() === 6}
						/>
					</PopoverContent>
				</Popover>
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
						className="flex w-30 self-center justify-self-start **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate md:hidden"
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
