"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
	date?: Date
	onChange?: (date: Date | undefined) => void
}

export function DatePicker({ date, onChange }: DatePickerProps) {
	const t = useTranslations("Calendar")
	return (
		<div className="grid gap-2">
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						data-empty={!date}
						className="data-[empty=true]:text-muted-foreground w-fit justify-start text-left font-normal"
					>
						<CalendarIcon />
						{date ? (
							format(date, "dd MMMM yyyy")
						) : (
							<span>{t("selectDate", { default: "Select a date" })}</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar mode="single" selected={date} onSelect={onChange} />
				</PopoverContent>
			</Popover>
		</div>
	)
}
