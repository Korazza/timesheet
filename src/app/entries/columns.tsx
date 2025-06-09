"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Entry } from "@/db/schema"

export const columns: ColumnDef<Entry>[] = [
	{
		accessorKey: "date",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Data
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
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
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Cliente
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
	},
	{
		accessorKey: "hours",
		header: () => <span className="">Ore</span>,
		cell: ({ row }) => {
			const hours = parseFloat(row.getValue("hours"))
			return <span>{`${hours} h`}</span>
		},
	},
]
