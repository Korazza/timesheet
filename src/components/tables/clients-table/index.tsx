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
import { ClientCreateDialog } from "@/components/dialogs/client-create-dialog"
import { ClientEditDialog } from "@/components/dialogs/client-edit-dialog"
import { Client } from "@/db/schema"
import { useClients } from "@/hooks/use-clients"
import { useDialog } from "@/hooks/use-dialog"
import { useTableColumns } from "./columns"
import { ClientsTableToolbar } from "./toolbar"
import { ClientsTablePagination } from "./pagination"

export function ClientsTable() {
	const { clients } = useClients()
	const { activeDialog, openDialog } = useDialog()
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	)
	const [editingClient, setEditingClient] = React.useState<Client | null>(null)

	const onEditClient = (client: Client) => {
		setEditingClient(client)
		openDialog("editClient")
	}

	React.useEffect(() => {
		if (activeDialog !== "editClient") setEditingClient(null)
	}, [activeDialog])

	const columns = useTableColumns({ onEdit: onEditClient })

	const table = useReactTable({
		data: clients,
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
			<ClientsTableToolbar table={table} />
			<ClientCreateDialog />
			<ClientEditDialog client={editingClient} />
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
			<ClientsTablePagination table={table} />
		</div>
	)
}
