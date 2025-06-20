"use client"

import { createContext, useState } from "react"

import type { Client } from "@/types"

type ClientContextType = {
	clients: Client[]
	setClients: React.Dispatch<React.SetStateAction<Client[]>>
}

export const ClientContext = createContext<ClientContextType | undefined>(
	undefined
)

export const ClientProvider = ({
	children,
	initialClients,
}: {
	children: React.ReactNode
	initialClients: Client[]
}) => {
	const [clients, setClients] = useState<Client[]>(initialClients)

	return (
		<ClientContext.Provider value={{ clients, setClients }}>
			{children}
		</ClientContext.Provider>
	)
}
