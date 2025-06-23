"use client"

import { Column } from "@tanstack/react-table"
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronsUpDown,
	EyeOff,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>
	title: string
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>
	}

	return (
		<Button
			size="sm"
			variant="ghost"
			className={cn("-ml-2.5", className)}
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
			{title}
			{column.getIsSorted() === "asc" ? (
				<ArrowUp className="ml-2 h-4 w-4" />
			) : column.getIsSorted() === "desc" ? (
				<ArrowDown className="ml-2 h-4 w-4" />
			) : (
				<ArrowUpDown className="ml-2 h-4 w-4" />
			)}
		</Button>
	)
}
