import { Employee } from "@/types"

export function assertIsAdmin(
	employee: Employee | null | undefined
): asserts employee is Employee & { role: "ADMIN" } {
	if (!employee || employee.role !== "ADMIN") {
		throw new Error("Forbidden")
	}
}
