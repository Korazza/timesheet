"use client"

import { ColumnDef } from "@tanstack/react-table"

import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	MoreHorizontal,
	Pencil,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Client } from "@/db/schema"

interface GetColumnsOptions {
	onEdit: (client: Client) => void
}

export function useTableColumns({
	onEdit,
}: GetColumnsOptions): ColumnDef<Client>[] {
	const t = useTranslations("Tables.Clients")
	const tCommon = useTranslations("Common")
	return [
		{
			accessorKey: "name",
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
					{t("name")}
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
					{t("description")}
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
			id: "actions",
			cell: ({ row }) => {
				const client = row.original
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
							<DropdownMenuItem onClick={() => onEdit(client)}>
								<Pencil /> {tCommon("edit")}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			},
		},
	]
}
