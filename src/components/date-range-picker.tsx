"use client"

import * as React from "react"
import { type DateRange } from "react-day-picker"
import { format } from "date-fns"

import { CalendarIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

type DateRangePickerProps = {
	dateRange?: DateRange
	onChange?: (dateRange: DateRange | undefined) => void
}

export default function DateRangePicker({
	dateRange,
	onChange,
}: DateRangePickerProps) {
	const t = useTranslations("Calendar")
	return (
		<div className="grid gap-2">
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant="outline"
						className={cn(
							"w-fit justify-start text-left font-normal",
							!dateRange && "text-muted-foreground"
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{dateRange?.from ? (
							dateRange.to &&
							dateRange.from.toDateString() !== dateRange.to.toDateString() ? (
								<>
									{format(dateRange.from, "dd")}-
									{format(dateRange.to, "dd MMMM yyyy")}
								</>
							) : (
								format(dateRange.from, "dd MMMM yyyy")
							)
						) : (
							<span>{t("selectRange", { default: "Select a range" })}</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						autoFocus
						mode="range"
						defaultMonth={dateRange?.from}
						selected={dateRange}
						onSelect={onChange}
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}
