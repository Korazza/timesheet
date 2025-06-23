"use client"

import * as React from "react"
import {
	ColumnFiltersState,
	SortingState,
	ColumnDef,
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
import { DataTablePagination } from "./pagination"
import { DataTableToolbar, ToolbarFilterOption } from "./toolbar"
import { DataTableRowActions } from "./row-actions"
import { useTranslations } from "next-intl"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	filters?: ToolbarFilterOption[]
	rowActions?: DataTableAction[]
	toolbarActions?: React.ReactNode[]
}

export function DataTable<TData, TValue>({
	columns,
	data,
	filters = [],
	rowActions,
	toolbarActions,
}: DataTableProps<TData, TValue>) {
	const tCommon = useTranslations("Common")
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	)

	const table = useReactTable({
		data,
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
			{(filters.length > 0 || toolbarActions) && (
				<div className="flex flex-col items-end justify-between gap-2 px-2 md:flex-row md:items-center md:px-0">
					<div className="flex flex-1 flex-wrap items-center gap-2">
						{filters.length > 0 && (
							<DataTableToolbar table={table} filters={filters} />
						)}
					</div>
					<div className="flex flex-wrap items-center gap-2">
						{toolbarActions &&
							toolbarActions.length > 0 &&
							toolbarActions.map((toolbarAction, idx) => (
								<React.Fragment key={idx}>{toolbarAction}</React.Fragment>
							))}
					</div>
				</div>
			)}
			<div className="border md:rounded-md md:shadow-xs">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									)
								})}
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
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
									{rowActions && (
										<TableCell>
											<DataTableRowActions
												actions={rowActions}
												row={row.original}
											/>
										</TableCell>
									)}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length + (rowActions ? 1 : 0)}
									className="h-24 text-center"
								>
									{tCommon("noResults")}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	)
}

export type DataTableAction = {
	label: string
	icon?: React.ReactNode
	onClick: (row: any) => void
	variant?: "default" | "destructive"
}
