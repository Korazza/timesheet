"use client"

import { ColumnDef } from "@tanstack/react-table"
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
import { Entry } from "@/db/schema"

interface GetColumnsOptions {
	onEdit: (entry: Entry) => void
	onDelete: (entry: Entry) => void
}

export const getColumns = ({
	onEdit,
	onDelete,
}: GetColumnsOptions): ColumnDef<Entry>[] => [
	{
		accessorKey: "date",
		filterFn: (row, id, filterDate) => {
			return (
				(row.getValue(id) as Date).toDateString() === filterDate.toDateString()
			)
		},
		header: ({ column }) => (
			<Button
				variant="ghost"
				className="!px-0 !py-0 !m-0"
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
					{date.toLocaleDateString()}
				</span>
			)
		},
	},

	{
		accessorKey: "clientId",
		header: ({ column }) => (
			<Button
				variant="ghost"
				className="!px-0 !py-0 !m-0"
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
		accessorKey: "hours",
		header: ({ column }) => (
			<Button
				variant="ghost"
				className="!px-0 !py-0 !m-0"
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
							<Pencil className="h-[0.1rem] w-[0.1rem]" /> Modifica
						</DropdownMenuItem>
						<DropdownMenuItem
							variant="destructive"
							onClick={() => onDelete(entry)}
						>
							<Trash className="h-0.5 w-0.5" /> Elimina
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]
