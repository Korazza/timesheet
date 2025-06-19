"use client"

import { Table } from "@tanstack/react-table"
import { FunnelX, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDialog } from "@/hooks/use-dialog"
import { useTranslations } from "next-intl"

interface ClientsTableToolbarProps<Client> {
	table: Table<Client>
}

export function ClientsTableToolbar<Client>({
	table,
}: ClientsTableToolbarProps<Client>) {
	const t = useTranslations("Common")
	const { openDialog } = useDialog()
	const isFiltered = table.getState().columnFilters.length > 0

	return (
		<div className="flex flex-col items-end justify-between gap-2 px-2 md:flex-row md:items-center md:px-0">
			<div className="flex flex-1 flex-wrap items-center gap-2">
				<Input
					placeholder={t("namePlaceholder")}
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[200px] lg:w-[300px]"
				/>
				<Input
					placeholder={t("descriptionPlaceholder")}
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
						{t("reset")}
					</Button>
				)}
			</div>
			<Button size="lg" onClick={() => openDialog("createClient")}>
				<Plus />
				{t("add")}
			</Button>
		</div>
	)
}
