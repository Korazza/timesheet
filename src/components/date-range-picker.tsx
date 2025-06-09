"use client"

import * as React from "react"
import { type DateRange } from "react-day-picker"
import { addDays, format } from "date-fns"
import { it } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

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
	className,
	dateRange,
	onChange,
}: DateRangePickerProps & React.HTMLAttributes<HTMLDivElement>) {
	const [date, setDate] = React.useState<DateRange | undefined>({
		from: dateRange?.from || new Date(),
		to: dateRange?.to,
	})

	return (
		<div className={cn("grid gap-2", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant="outline"
						className={cn(
							"w-[300px] justify-start text-left font-normal",
							!date && "text-muted-foreground"
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date?.from ? (
							date.to && date.from.toDateString() !== date.to.toDateString() ? (
								<>
									{format(date.from, "P", { locale: it })} -{" "}
									{format(date.to, "P", { locale: it })}
								</>
							) : (
								format(date.from, "P", { locale: it })
							)
						) : (
							<span>Seleziona una data</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						autoFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={(selected) => {
							if (onChange) onChange(selected)
							setDate(selected)
						}}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}
