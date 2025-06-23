"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { FunnelX } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DataTableFacetedFilter } from "@/components/table-faceted-filter"

export type FilterType = "input" | "select" | "faceted"

export interface ToolbarFilterOption {
	id: string
	type: FilterType
	options?: { label: string; value: string }[]
	placeholder?: string
}

interface DataTableToolbarProps<TData> {
	table: Table<TData>
	filters: ToolbarFilterOption[]
}

export function DataTableToolbar<TData>({
	table,
	filters,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0

	return (
		<div className="flex flex-col items-end justify-between gap-2 px-2 md:flex-row md:items-center md:px-0">
			<div className="flex flex-1 flex-wrap items-center gap-2">
				{filters.map((filter) => {
					const column = table.getColumn(filter.id)
					if (!column) return null
					const value = column.getFilterValue() ?? ""
					if (filter.type === "input") {
						return (
							<Input
								key={filter.id}
								placeholder={filter.placeholder}
								value={value as string}
								onChange={(e) => column.setFilterValue(e.target.value)}
								className="h-8 w-[150px] lg:w-[200px]"
							/>
						)
					}
					if (filter.type === "select" && filter.options) {
						return (
							<Select
								key={filter.id}
								value={value as string}
								onValueChange={(v) => column.setFilterValue(v)}
							>
								<SelectTrigger className="h-8 w-[150px] lg:w-[200px]">
									<SelectValue placeholder={filter.placeholder} />
								</SelectTrigger>
								<SelectContent>
									{filter.options.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)
					}
					if (filter.type === "faceted" && filter.options) {
						return (
							<DataTableFacetedFilter
								key={filter.id}
								column={column}
								title={filter.placeholder}
								options={filter.options}
							/>
						)
					}
					return null
				})}
				{isFiltered && (
					<Button
						variant="secondary"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3"
					>
						<FunnelX className="mr-1 size-4" />
						Reset
					</Button>
				)}
			</div>
		</div>
	)
}
