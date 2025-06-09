"use client"

import * as React from "react"
import {
	ColumnFiltersState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Entry } from "@/db/schema"
import { getColumns } from "./columns"
import { EntryUpdateDialog } from "@/components/dialogs/entry-update-dialog"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DatePicker } from "@/components/date-picker"
import DateRangePicker from "@/components/date-range-picker"

interface EntriesTableProps {
	entries: Entry[]
}

export function EntriesTable({ entries }: EntriesTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	)

	const [editingEntry, setEditingEntry] = React.useState<Entry | null>(null)

	const onEditEntry = (entry: Entry) => {
		setEditingEntry(entry)
	}

	const onDeleteEntry = (entry: Entry) => {
		if (confirm(`Vuoi davvero eliminare l’entry del ${entry.date}?`)) {
			console.log("Elimino:", entry)
		}
	}

	const onEntryUpdateDialogOpeningChange = (open: boolean) => {
		if (!open) setEditingEntry(null)
	}

	const columns = getColumns({ onEdit: onEditEntry, onDelete: onDeleteEntry })

	const table = useReactTable({
		data: entries,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	})

	return (
		<div>
			<EntryUpdateDialog
				open={editingEntry !== null}
				entry={editingEntry}
				onOpenChange={onEntryUpdateDialogOpeningChange}
			/>
			<div className="flex items-center py-4 gap-2">
				<Input
					placeholder="Filtra clienti..."
					value={
						(table.getColumn("clientId")?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table.getColumn("clientId")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<DateRangePicker
				/* 					date={
						(table.getColumn("date")?.getFilterValue() as Date) ?? new Date()
					}
					onChange={(date) => table.getColumn("date")?.setFilterValue(date)} */
				/>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className={cell.column.id === "actions" ? "" : ""}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Nessun risultato
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<ChevronLeft />
				</Button>
				<Button disabled={true} variant="outline">
					{table.getPageCount()}
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<ChevronRight />
				</Button>
			</div>
		</div>
	)
}
