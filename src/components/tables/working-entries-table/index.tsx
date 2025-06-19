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
import { WorkingEntryCreateDialog } from "@/components/dialogs/working-entry-create-dialog"
import { WorkingEntryEditDialog } from "@/components/dialogs/working-entry-edit-dialog"
import { EntryConfirmDeleteDialog } from "@/components/dialogs/entry-confirm-delete-dialog"
import { Entry } from "@/db/schema"
import { useEntries } from "@/hooks/use-entries"
import { useDialog } from "@/hooks/use-dialog"
import { useTableColumns } from "./columns"
import { WorkingEntriesTableToolbar } from "./toolbar"
import { WorkingEntriesTablePagination } from "./pagination"

export function WorkingEntriesTable() {
	const { workingEntries } = useEntries()
	const { activeDialog, openDialog } = useDialog()
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	)
	const [editingEntry, setEditingEntry] = React.useState<Entry | null>(null)
	const [deletingEntry, setDeletingEntry] = React.useState<Entry | null>(null)

	const onEditEntry = (entry: Entry) => {
		setEditingEntry(entry)
		openDialog("editWorkingEntry")
	}

	const onDeleteEntry = (entry: Entry) => {
		setDeletingEntry(entry)
		openDialog("confirmDeleteEntry")
	}

	React.useEffect(() => {
		if (activeDialog !== "editWorkingEntry") setEditingEntry(null)
		if (activeDialog !== "confirmDeleteEntry") setDeletingEntry(null)
	}, [activeDialog])

	const columns = useTableColumns({
		onEdit: onEditEntry,
		onDelete: onDeleteEntry,
	})

	const table = useReactTable({
		data: workingEntries,
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
		<div className="flex flex-1 flex-col gap-4">
			<WorkingEntriesTableToolbar table={table} />
			<WorkingEntryCreateDialog />
			<WorkingEntryEditDialog entry={editingEntry} />
			<EntryConfirmDeleteDialog entry={deletingEntry} />
			<div className="border md:rounded-md md:shadow-xs">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										className="px-3"
										colSpan={header.colSpan}
									>
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
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="">
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
			<WorkingEntriesTablePagination table={table} />
		</div>
	)
}
