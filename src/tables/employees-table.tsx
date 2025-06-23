"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Pencil, Trash, Eye } from "lucide-react"

import { DataTable, DataTableAction } from "@/components/data-table"
import { DataTableColumnHeader } from "@/components/data-table/column-header"
import { ToolbarFilterOption } from "@/components/data-table/toolbar"
import type { Employee, Role } from "@/types"
import { useEnumOptions } from "@/hooks/use-enum-options"
import { Button } from "@/components/ui/button"
import { useDialog } from "@/hooks/use-dialog"

interface EmployeesTableProps {
	employees: Employee[]
}

export default function EmployeesTable({ employees }: EmployeesTableProps) {
	const router = useRouter()
	const { openDialog } = useDialog()
	const { roleOptions } = useEnumOptions()
	const t = useTranslations("Tables.Employees")
	const tCommon = useTranslations("Common")

	const columns: ColumnDef<Employee>[] = [
		{
			accessorKey: "firstName",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("name")} />
			),
		},
		{
			accessorKey: "lastName",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("lastName")} />
			),
		},
		{
			accessorKey: "email",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("email")} />
			),
		},
		{
			accessorKey: "role",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("role")} />
			),
			cell: ({ row }) => {
				const role: Role = row.getValue("role")
				return (
					<span>
						{roleOptions.find((option) => option.value === role)?.label}
					</span>
				)
			},
		},
	]

	const filters: ToolbarFilterOption[] = [
		{
			id: "firstName",
			type: "input",
			placeholder: tCommon("firstNamePlaceholder"),
		},
		{
			id: "lastName",
			type: "input",
			placeholder: tCommon("lastNamePlaceholder"),
		},
		{
			id: "email",
			type: "input",
			placeholder: tCommon("emailPlaceholder"),
		},
		{
			id: "role",
			type: "select",
			placeholder: tCommon("rolePlaceholder"),
			options: roleOptions,
		},
	]

	const handleAdd = () => openDialog("createEmployee")

	const handleEdit = (employee: Employee) =>
		openDialog("editEmployee", { employee })

	const handleDelete = (employee: Employee) =>
		openDialog("confirmDeleteEmployee", { employee })

	const toolbarActions = [
		<Button key="add-employee" onClick={handleAdd}>
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
		{
			label: tCommon("delete"),
			icon: <Trash className="size-4" />,
			variant: "destructive",
			onClick: handleDelete,
		},
	]

	return (
		<DataTable
			data={employees}
			columns={columns}
			filters={filters}
			toolbarActions={toolbarActions}
			rowActions={rowActions}
		/>
	)
}
