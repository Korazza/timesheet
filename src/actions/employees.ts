import { unstable_cache } from "next/cache"
import { eq } from "drizzle-orm"

import db from "@/db"
import { employeesTable } from "@/db/schema"
import { Employee, EmployeeWithAvatar } from "@/types"
import { getUser, getUserAvatar } from "@/utils/supabase/user"
import { assertIsAdmin } from "@/utils/assert-role"
import { cache } from "react"

const getCachedEmployee = (userId: string) =>
	unstable_cache(
		async () => {
			return db.query.employeesTable.findFirst({
				where: eq(employeesTable.userId, userId),
			})
		},
		[`employee-${userId}`],
		{
			tags: ["user"],
		}
	)()

export const getEmployee = async (): Promise<EmployeeWithAvatar | null> => {
	const user = await getUser()

	if (!user) {
		return null
	}

	const employee = await getCachedEmployee(user.id)

	return employee
		? {
				...employee,
				avatarUrl: await getUserAvatar(user),
			}
		: null
}

export const getEmployeeById = cache(
	async (employeeId: string): Promise<Employee | undefined> =>
		db.query.employeesTable.findFirst({
			where: eq(employeesTable.userId, employeeId),
		})
)

export const getEmployees = async (): Promise<Employee[]> => {
	const user = await getUser()
	if (!user) throw new Error("Unauthorized")

	const employee = await getCachedEmployee(user.id)
	assertIsAdmin(employee)

	return db.query.employeesTable.findMany()
}
