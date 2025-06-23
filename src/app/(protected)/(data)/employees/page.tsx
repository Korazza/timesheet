import { getEmployees } from "@/actions/employees"
import EmployeesTable from "@/components/tables/employees-table"
import type { Employee } from "@/types"

export default async function EmployeesPage() {
	const employees: Employee[] = await getEmployees()

	return (
		<div className="flex h-full flex-col gap-4 py-4 md:p-4">
			<EmployeesTable employees={employees} />
		</div>
	)
}
