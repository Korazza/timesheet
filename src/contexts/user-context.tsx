"use client"

import { createContext, useState } from "react"

import type { Employee } from "@/db/schema"

type EmployeeContextType = {
	user: Employee
}

export const UserContext = createContext<EmployeeContextType | undefined>(
	undefined
)

export const UserProvider = ({
	children,
	employee,
}: {
	children: React.ReactNode
	employee: Employee
}) => {
	const [user] = useState<Employee>(employee)

	return (
		<UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
	)
}
