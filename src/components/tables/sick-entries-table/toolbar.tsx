"use client"

import { useState } from "react"
import { Table } from "@tanstack/react-table"
import { FunnelX, Plus } from "lucide-react"
import { DateRange } from "react-day-picker"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import DateRangePicker from "@/components/date-range-picker"
import { useDialog } from "@/hooks/use-dialog"

interface SickEntriesTableToolbarProps<Entry> {
	table: Table<Entry>
}

export function SickEntriesTableToolbar<Entry>({
	table,
}: SickEntriesTableToolbarProps<Entry>) {
	const t = useTranslations("Common")
	const { openDialog } = useDialog()
	const defaultDateRange: DateRange = { from: undefined }
	const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange)
	const isFiltered = table.getState().columnFilters.length > 0

	return (
		<div className="flex flex-col md:flex-row items-end md:items-center gap-2 justify-between px-2 md:px-0">
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
						{t("reset")}
					</Button>
				)}
			</div>
			<Button size="lg" onClick={() => openDialog("createSickEntry")}>
				<Plus />
				{t("add")}
			</Button>
		</div>
	)
}
