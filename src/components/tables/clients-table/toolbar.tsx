"use client"

import { Table } from "@tanstack/react-table"
import { FunnelX, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDialog } from "@/hooks/use-dialog"

interface ClientsTableToolbarProps<Client> {
	table: Table<Client>
}

export function ClientsTableToolbar<Client>({
	table,
}: ClientsTableToolbarProps<Client>) {
	const { openDialog } = useDialog()
	const isFiltered = table.getState().columnFilters.length > 0

	return (
		<div className="flex flex-col md:flex-row items-end md:items-center gap-2 justify-between">
			<div className="flex flex-1 flex-wrap gap-2 items-center">
				<Input
					placeholder="Nome..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[200px] lg:w-[300px]"
				/>
				<Input
					placeholder="Descrizione..."
					value={
						(table.getColumn("description")?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table.getColumn("description")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[200px] lg:w-[300px]"
				/>
				{isFiltered && (
					<Button
						variant="secondary"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3"
					>
						<FunnelX />
						Reset
					</Button>
				)}
			</div>
			<Button size="lg" onClick={() => openDialog("createClient")}>
				<Plus />
				Aggiungi
			</Button>
		</div>
	)
}
