"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { EntryWithClient } from "@/types"
import { useDialog } from "@/hooks/use-dialog"
import { useDroppable } from "@dnd-kit/core"
import { isSameMonth, isToday } from "date-fns"
import { cn } from "@/lib/utils"
import { TimesheetCalendarViewType } from "."
import { TimesheetCalendarEntryPill } from "./entry-pill"

interface TimesheetCalendarCellProps {
	viewType: TimesheetCalendarViewType
	calendarDate: Date
	day: Date
	dayEntries: EntryWithClient[]
	setSelectedEntry: React.Dispatch<React.SetStateAction<EntryWithClient | null>>
	setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}

export const TimesheetCalendarCell = React.forwardRef<
	HTMLDivElement,
	TimesheetCalendarCellProps & React.HTMLAttributes<HTMLDivElement>
>(
	(
		{
			viewType,
			calendarDate,
			day,
			dayEntries,
			setSelectedEntry,
			setSelectedDate,
			...props
		},
		ref
	) => {
		const t = useTranslations("Calendar")
		const { closeDialog } = useDialog()
		const { setNodeRef } = useDroppable({
			id: `timesheet-calendar-cell-${day.toISOString()}`,
			data: { day },
		})

		// Merge refs: forwardRef and setNodeRef
		const mergedRef = React.useCallback(
			(node: HTMLDivElement | null) => {
				if (typeof ref === "function") ref(node)
				else if (ref && typeof ref === "object" && ref !== null)
					(ref as React.RefObject<HTMLDivElement | null>).current = node
				setNodeRef(node)
			},
			[ref, setNodeRef]
		)

		return (
			<div
				ref={mergedRef}
				{...props}
				className={cn(
					"bg-card text-card-foreground flex flex-col gap-1.5 border p-2 transition-all",
					viewType === "month" &&
						!isSameMonth(day, calendarDate) &&
						"opacity-25",
					isToday(day) && "border-t-primary xl:border-primary border-2",
					viewType === "week" && "gap-4",
					viewType === "day" && "gap-6 p-4",
					props.className
				)}
			>
				{viewType !== "day" && viewType !== "week" && (
					<span
						className={cn(
							"text-muted-foreground ml-auto max-w-fit font-bold",
							isToday(day) &&
								"bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 shadow",
							viewType === "month" && "text-sm"
						)}
					>
						{day.getDate()}
					</span>
				)}

				{viewType === "day" && dayEntries.length === 0 ? (
					<div className="text-muted-foreground flex flex-1 items-center justify-center">
						<span className="text-lg lg:text-xl">{t("noEntries")}</span>
					</div>
				) : (
					<div
						className={cn(
							"flex flex-1 flex-col gap-1 md:gap-1.5",
							viewType === "week" && "mt-2.5 gap-2.5 md:mt-6 md:gap-6",
							viewType === "day" &&
								"gap-4 md:gap-6 lg:items-center lg:justify-center lg:gap-8"
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
								<TimesheetCalendarEntryPill entry={entry} viewType={viewType} />
							</div>
						))}
					</div>
				)}
			</div>
		)
	}
)
TimesheetCalendarCell.displayName = "TimesheetCalendarCell"
