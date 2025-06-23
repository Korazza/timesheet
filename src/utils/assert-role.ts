export function assertIsAdmin(
	employee: { role?: string } | null | undefined
): asserts employee is { role: "ADMIN" } {
	if (!employee || employee.role !== "ADMIN") {
		throw new Error("Forbidden")
	}
}
