"use client"

import { useTranslations } from "next-intl"
import { useDraggable } from "@dnd-kit/core"

import { EntryWithClient } from "@/types"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { TimesheetCalendarViewType } from "."
import { z } from "zod"

interface TimesheetCalendarEntryPillProps {
	entry: EntryWithClient
	viewType: TimesheetCalendarViewType
}

export function TimesheetCalendarEntryPill({
	entry,
	viewType,
}: TimesheetCalendarEntryPillProps) {
	const t = useTranslations("Calendar")
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: `draggable-${entry.id}`,
		data: { entry },
	})
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

	const style = {
		backgroundColor: colorMap[entry.type],
		color: foregroundColorMap[entry.type],
		transform: transform
			? `translate3d(${transform.x}px, ${transform.y}px, 0)`
			: undefined,
		zIndex: transform ? 50000 : 0,
	}

	const content = (
		<div
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			className="rounded px-2.5 py-1 shadow transition-shadow hover:shadow-xl md:px-3 md:py-1.5"
			style={style}
			suppressHydrationWarning
		>
			<div
				className={cn(
					"flex flex-col gap-1",
					"md:flex-row md:items-center md:justify-between"
				)}
			>
				<div className="max-w-full truncate text-xs font-semibold md:text-sm">
					{labelMap[entry.type]}
				</div>
				<div className="text-sm font-bold md:text-base">
					{totalHours} h
					{entry.overtimeHours && (
						<span className="-z-10 ml-1 text-xs font-medium opacity-80">
							(+ {entry.overtimeHours} h)
						</span>
					)}
				</div>
			</div>

			{(viewType === "day" || !isMobile) && entry.description && (
				<div className="mt-0.5 line-clamp-2 max-w-full text-xs font-medium break-words opacity-80">
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
