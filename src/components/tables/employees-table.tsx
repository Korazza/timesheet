"use client"

import { DataTable } from "@/components/data-table"
import { DataTableColumnHeader } from "@/components/data-table/column-header"
import type { Employee } from "@/types"
import { ColumnDef } from "@tanstack/react-table"

interface EmployeesTableProps {
	employees: Employee[]
}

export default function EmployeesTable({ employees }: EmployeesTableProps) {
	const columns: ColumnDef<Employee>[] = [
		{
			accessorKey: "firstName",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Nome" />
			),
		},
		{
			accessorKey: "lastName",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Cognome" />
			),
		},
		{
			accessorKey: "email",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Email" />
			),
		},
		{
			accessorKey: "role",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Ruolo" />
			),
		},
	]

	return <DataTable data={employees} columns={columns} />
}
