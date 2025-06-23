import { getEmployees } from "@/actions/employees"
import { User } from "lucide-react"

import EmployeesTable from "@/components/tables/employees-table"
import { getTranslations } from "next-intl/server"
import type { Employee } from "@/types"

export default async function EmployeesPage() {
	const t = await getTranslations("Employees")
	const employees: Employee[] = await getEmployees()

	return (
		<div className="container mx-auto py-8">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="flex items-center gap-2 text-3xl font-bold">
					<User className="h-7 w-7" /> {t("title")}
				</h1>
			</div>
			<EmployeesTable employees={employees} />
		</div>
	)
}
