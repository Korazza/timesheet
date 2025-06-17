"use client"

import { useMemo, useState } from "react"
import { Table } from "@tanstack/react-table"
import { FunnelX, Plus } from "lucide-react"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DateRangePicker from "@/components/date-range-picker"
import { DataTableFacetedFilter } from "@/components/table-faceted-filter"
import { useClients } from "@/hooks/use-clients"
import { useDialog } from "@/hooks/use-dialog"

interface WorkingEntriesTableToolbarProps<Entry> {
	table: Table<Entry>
}

export function WorkingEntriesTableToolbar<Entry>({
	table,
}: WorkingEntriesTableToolbarProps<Entry>) {
	const { clients } = useClients()
	const clientsOptions = useMemo(
		() => clients.map((c) => ({ label: c.name, value: c.name })),
		[clients]
	)
	const { openDialog } = useDialog()
	const defaultDateRange: DateRange = { from: undefined }
	const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange)
	const isFiltered = table.getState().columnFilters.length > 0

	return (
		<div className="flex flex-col md:flex-row items-end md:items-center gap-2 justify-between px-2 md:px-0">
			<div className="flex flex-1 flex-wrap gap-2 items-center">
				<Input
					placeholder="Descrizione..."
					value={
						(table.getColumn("description")?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table.getColumn("description")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[200px] lg:w-[300px]"
				/>
				{table.getColumn("date") && (
					<DateRangePicker
						dateRange={dateRange}
						onChange={(selected) => {
							table.getColumn("date")?.setFilterValue(selected)
							if (selected) setDateRange(selected)
						}}
					/>
				)}
				{table.getColumn("client") && (
					<DataTableFacetedFilter
						column={table.getColumn("client")}
						title="Cliente"
						options={clientsOptions}
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
			<Button size="lg" onClick={() => openDialog("createWorkingEntry")}>
				<Plus />
				Aggiungi
			</Button>
		</div>
	)
}
