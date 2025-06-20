"use client"

import { createContext, useState } from "react"

import type { EmployeeWithAvatar } from "@/types"

type EmployeeContextType = {
	user: EmployeeWithAvatar
}

export const UserContext = createContext<EmployeeContextType | undefined>(
	undefined
)

export const UserProvider = ({
	children,
	employee,
}: {
	children: React.ReactNode
	employee: EmployeeWithAvatar
}) => {
	const [user] = useState<EmployeeWithAvatar>(employee)

	return (
		<UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
	)
}
