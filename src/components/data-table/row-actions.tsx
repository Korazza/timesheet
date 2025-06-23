"use client"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import * as React from "react"

export type DataTableAction = {
	label: string
	icon?: React.ReactNode
	onClick: (row: any) => void
	variant?: "default" | "destructive"
}

interface DataTableRowActionsProps {
	actions: DataTableAction[]
	row: any
}

export function DataTableRowActions({
	actions,
	row,
}: DataTableRowActionsProps) {
	if (!actions?.length) return null
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="size-8 p-0">
					<span className="sr-only">Azioni</span>
					<MoreHorizontal className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Azioni</DropdownMenuLabel>
				{actions.map((action, i) => (
					<DropdownMenuItem
						key={i}
						onClick={() => action.onClick(row)}
						variant={action.variant}
					>
						{action.icon}
						{action.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
