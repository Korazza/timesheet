"use server"

import { revalidateTag, unstable_cache } from "next/cache"
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

export const getEmployeeByUserId = cache(
	async (employeeUserId: string): Promise<Employee | undefined> =>
		db.query.employeesTable.findFirst({
			where: eq(employeesTable.userId, employeeUserId),
		})
)

export const getEmployeeById = cache(
	async (employeeId: string): Promise<Employee | undefined> =>
		db.query.employeesTable.findFirst({
			where: eq(employeesTable.id, employeeId),
		})
)

export const getEmployees = async (): Promise<Employee[]> => {
	const user = await getUser()
	if (!user) throw new Error("Unauthorized")
	const userEmployee = await getCachedEmployee(user.id)
	assertIsAdmin(userEmployee)
	return db.query.employeesTable.findMany()
}

export const addEmployee = async (
	employee: typeof employeesTable.$inferInsert
) => {
	const user = await getUser()
	if (!user) throw new Error("Unauthorized")
	const userEmployee = await getCachedEmployee(user.id)
	assertIsAdmin(userEmployee)
	return db.insert(employeesTable).values(employee).returning()
}

export const updateEmployee = async (employee: Employee) => {
	const user = await getUser()
	if (!user) throw new Error("Unauthorized")
	const userEmployee = await getCachedEmployee(user.id)
	assertIsAdmin(userEmployee)
	await db
		.update(employeesTable)
		.set(employee)
		.where(eq(employeesTable.id, employee.id))
	revalidateTag("user")
}

export const deleteEmployee = async (employeeId: Employee["id"]) => {
	const user = await getUser()
	if (!user) throw new Error("Unauthorized")
	const userEmployee = await getCachedEmployee(user.id)
	assertIsAdmin(userEmployee)

	const employee = await db.query.employeesTable.findFirst({
		where: eq(employeesTable.id, employeeId),
	})

	if (employee) {
		await db.delete(employeesTable).where(eq(employeesTable.id, employeeId))
	}
}
