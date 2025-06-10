"use client"

import { createContext, useState } from "react"

type DialogId = "editEntry" | "createEntry" | "confirmDeleteEntry" | null

type DialogContextType = {
	activeDialog: DialogId
	openDialog: (dialog: DialogId) => void
	closeDialog: () => void
}

export const DialogContext = createContext<DialogContextType | undefined>(
	undefined
)

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
	const [activeDialog, setActiveDialog] = useState<DialogId>(null)

	const openDialog = (dialog: DialogId) => setActiveDialog(dialog)
	const closeDialog = () => setActiveDialog(null)

	return (
		<DialogContext.Provider value={{ activeDialog, openDialog, closeDialog }}>
			{children}
		</DialogContext.Provider>
	)
}
