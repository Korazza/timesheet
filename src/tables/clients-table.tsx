"use client"

import { useTranslations } from "next-intl"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Pencil } from "lucide-react"

import { DataTable, DataTableAction } from "@/components/data-table"
import { DataTableColumnHeader } from "@/components/data-table/column-header"
import { ToolbarFilterOption } from "@/components/data-table/toolbar"
import type { Client } from "@/types"
import { Button } from "@/components/ui/button"
import { useDialog } from "@/hooks/use-dialog"

interface ClientsTableProps {
	clients: Client[]
}

export function ClientsTable({ clients }: ClientsTableProps) {
	const { openDialog } = useDialog()
	const t = useTranslations("Tables.Clients")
	const tCommon = useTranslations("Common")

	const columns: ColumnDef<Client>[] = [
		{
			accessorKey: "name",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("name")} />
			),
		},
		{
			accessorKey: "description",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("description")} />
			),
		},
	]

	const filters: ToolbarFilterOption[] = [
		{
			id: "name",
			type: "input",
			placeholder: tCommon("namePlaceholder"),
		},
		{
			id: "description",
			type: "input",
			placeholder: tCommon("descriptionPlaceholder"),
		},
	]

	const handleAdd = () => openDialog("createClient")

	const handleEdit = (client: Client) => openDialog("editClient", { client })

	const toolbarActions = [
		<Button key="add-client" onClick={handleAdd}>
			<Plus className="size-4" />
			{tCommon("add")}
		</Button>,
	]

	const rowActions: DataTableAction[] = [
		{
			label: tCommon("edit"),
			icon: <Pencil className="size-4" />,
			onClick: handleEdit,
		},
	]

	return (
		<DataTable
			data={clients}
			columns={columns}
			filters={filters}
			toolbarActions={toolbarActions}
			rowActions={rowActions}
		/>
	)
}
