"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { useTranslations } from "next-intl"

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

export function useTableColumns({
	onEdit,
	onDelete,
}: GetColumnsOptions): ColumnDef<EntryWithClient>[] {
	const t = useTranslations("Tables.Permit")
	const tCommon = useTranslations("Common")
	return [
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
					{t("date")}
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
					{t("hours")}
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
								<span className="sr-only">{tCommon("openMenu")}</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>{tCommon("actions")}</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => onEdit(entry)}>
								<Pencil /> {tCommon("edit")}
							</DropdownMenuItem>
							<DropdownMenuItem
								variant="destructive"
								onClick={() => onDelete(entry)}
							>
								<Trash /> {tCommon("delete")}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			},
		},
	]
}
