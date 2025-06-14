"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	MoreHorizontal,
	Pencil,
	Trash,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Entry, EntryWithClient } from "@/db/schema"

interface GetColumnsOptions {
	onEdit: (entry: Entry) => void
	onDelete: (entry: Entry) => void
}

export const getColumns = ({
	onEdit,
	onDelete,
}: GetColumnsOptions): ColumnDef<EntryWithClient>[] => [
	{
		accessorKey: "date",
		filterFn: (row, id, value) => {
			const rawValue = new Date(row.getValue(id))
			if (!(rawValue instanceof Date)) return false

			const valueDate = new Date(rawValue)
			valueDate.setHours(0, 0, 0, 0)

			const fromDate = value.from ? new Date(value.from) : undefined
			const toDate = value.to ? new Date(value.to) : undefined

			if (fromDate) fromDate.setHours(0, 0, 0, 0)
			if (toDate) toDate.setHours(0, 0, 0, 0)

			if (fromDate && toDate) {
				return valueDate >= fromDate && valueDate <= toDate
			}
			if (fromDate) {
				return valueDate >= fromDate
			}
			if (toDate) {
				return valueDate <= toDate
			}

			return true
		},
		header: ({ column }) => (
			<Button
				size="sm"
				variant="ghost"
				className="-ml-3"
				onClick={() => {
					if (column.getIsSorted() === "desc") {
						column.toggleSorting(false)
					} else if (column.getIsSorted() === "asc") {
						column.clearSorting()
					} else {
						column.toggleSorting(true)
					}
				}}
			>
				Data
				{column.getIsSorted() === "asc" ? (
					<ArrowUp className="ml-2 h-4 w-4" />
				) : column.getIsSorted() === "desc" ? (
					<ArrowDown className="ml-2 h-4 w-4" />
				) : (
					<ArrowUpDown className="ml-2 h-4 w-4" />
				)}
			</Button>
		),
		cell: ({ row }) => {
			const date = new Date(row.getValue("date"))
			return (
				<span className="font-medium" suppressHydrationWarning>
					{format(date, "P")}
				</span>
			)
		},
	},
	{
		accessorKey: "client",
		accessorFn: (row) => (row.client ? row.client.name : ""),
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		},
		header: ({ column }) => (
			<Button
				size="sm"
				variant="ghost"
				className="-ml-3"
				onClick={() => {
					if (column.getIsSorted() === "desc") {
						column.toggleSorting(false)
					} else if (column.getIsSorted() === "asc") {
						column.clearSorting()
					} else {
						column.toggleSorting(true)
					}
				}}
			>
				Cliente
				{column.getIsSorted() === "asc" ? (
					<ArrowUp className="ml-2 h-4 w-4" />
				) : column.getIsSorted() === "desc" ? (
					<ArrowDown className="ml-2 h-4 w-4" />
				) : (
					<ArrowUpDown className="ml-2 h-4 w-4" />
				)}
			</Button>
		),
	},
	{
		accessorKey: "description",
		filterFn: "includesString",
		header: ({ column }) => (
			<Button
				size="sm"
				variant="ghost"
				className="-ml-3"
				onClick={() => {
					if (column.getIsSorted() === "desc") {
						column.toggleSorting(false)
					} else if (column.getIsSorted() === "asc") {
						column.clearSorting()
					} else {
						column.toggleSorting(true)
					}
				}}
			>
				Descrizione
				{column.getIsSorted() === "asc" ? (
					<ArrowUp className="ml-2 h-4 w-4" />
				) : column.getIsSorted() === "desc" ? (
					<ArrowDown className="ml-2 h-4 w-4" />
				) : (
					<ArrowUpDown className="ml-2 h-4 w-4" />
				)}
			</Button>
		),
		cell: ({ row }) => {
			return (
				<div className="max-w-[600px] truncate">
					{row.getValue("description")}
				</div>
			)
		},
	},
	{
		accessorKey: "hours",
		header: ({ column }) => (
			<Button
				size="sm"
				variant="ghost"
				className="-ml-3"
				onClick={() => {
					if (column.getIsSorted() === "desc") {
						column.toggleSorting(false)
					} else if (column.getIsSorted() === "asc") {
						column.clearSorting()
					} else {
						column.toggleSorting(true)
					}
				}}
			>
				Ore
				{column.getIsSorted() === "asc" ? (
					<ArrowUp className="ml-2 h-4 w-4" />
				) : column.getIsSorted() === "desc" ? (
					<ArrowDown className="ml-2 h-4 w-4" />
				) : (
					<ArrowUpDown className="ml-2 h-4 w-4" />
				)}
			</Button>
		),
		cell: ({ row }) => `${row.getValue("hours")} h`,
	},
	{
		accessorKey: "overtimeHours",
		header: ({ column }) => (
			<Button
				size="sm"
				variant="ghost"
				className="-ml-3"
				onClick={() => {
					if (column.getIsSorted() === "desc") {
						column.toggleSorting(false)
					} else if (column.getIsSorted() === "asc") {
						column.clearSorting()
					} else {
						column.toggleSorting(true)
					}
				}}
			>
				Straordinari
				{column.getIsSorted() === "asc" ? (
					<ArrowUp className="ml-2 h-4 w-4" />
				) : column.getIsSorted() === "desc" ? (
					<ArrowDown className="ml-2 h-4 w-4" />
				) : (
					<ArrowUpDown className="ml-2 h-4 w-4" />
				)}
			</Button>
		),
		cell: ({ row }) => {
			const overtimeHours = row.getValue("overtimeHours")
			return overtimeHours ? `${overtimeHours} h` : ""
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const entry = row.original
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Azioni</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => onEdit(entry)}>
							<Pencil /> Modifica
						</DropdownMenuItem>
						<DropdownMenuItem
							variant="destructive"
							onClick={() => onDelete(entry)}
						>
							<Trash /> Elimina
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]
