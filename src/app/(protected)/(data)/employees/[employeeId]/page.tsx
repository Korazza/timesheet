import { notFound } from "next/navigation"
import { getEmployeeById, getEmployeeByUserId } from "@/actions/employees"
import { getEntries } from "@/actions/entries"
import { assertIsAdmin } from "@/utils/assert-role"
import { getUser } from "@/utils/supabase/user"
import { EmployeeStatsClient } from "@/components/employee-stats-client"

export default async function EmployeeStatsPage({
	params,
}: {
	params: Promise<{ employeeId: string }>
}) {
	const user = await getUser()
	if (!user) return notFound()
	const userEmployee = await getEmployeeByUserId(user.id)
	if (!userEmployee) return notFound()
	assertIsAdmin(userEmployee)
	const { employeeId } = await params
	const employee = await getEmployeeById(employeeId)
	if (!employee) return notFound()
	const entries = await getEntries(employeeId)

	return <EmployeeStatsClient entries={entries} employee={employee} />
}
