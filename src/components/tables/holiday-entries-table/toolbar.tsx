"use client"

import { useState } from "react"
import { Table } from "@tanstack/react-table"
import { FunnelX, Plus } from "lucide-react"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import DateRangePicker from "@/components/date-range-picker"
import { useDialog } from "@/hooks/use-dialog"

interface HolidayEntriesTableToolbarProps<Entry> {
	table: Table<Entry>
}

export function HolidayEntriesTableToolbar<Entry>({
	table,
}: HolidayEntriesTableToolbarProps<Entry>) {
	const { openDialog } = useDialog()
	const defaultDateRange: DateRange = { from: undefined }
	const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange)
	const isFiltered = table.getState().columnFilters.length > 0

	return (
		<div className="flex flex-col md:flex-row items-end md:items-center gap-2 justify-between">
			<div className="flex flex-1 flex-wrap gap-2 items-center">
				{table.getColumn("date") && (
					<DateRangePicker
						dateRange={dateRange}
						onChange={(selected) => {
							table.getColumn("date")?.setFilterValue(selected)
							if (selected) setDateRange(selected)
						}}
					/>
				)}
				{isFiltered && (
					<Button
						variant="secondary"
						onClick={() => {
							table.getColumn("date")?.setFilterValue(defaultDateRange)
							setDateRange(defaultDateRange)
							table.resetColumnFilters()
						}}
						className="h-8 px-2 lg:px-3"
					>
						<FunnelX />
						Reset
					</Button>
				)}
			</div>
			<Button size="lg" onClick={() => openDialog("createHolidayEntry")}>
				<Plus />
				Aggiungi
			</Button>
		</div>
	)
}
