"use client"

import { cloneElement, createContext, ReactElement, useState } from "react"

export type DialogId =
	| "editWorkingEntry"
	| "createWorkingEntry"
	| "editHolidayEntry"
	| "createHolidayEntry"
	| "editPermitEntry"
	| "createPermitEntry"
	| "editSickEntry"
	| "createSickEntry"
	| "confirmDeleteEntry"
	| "createClient"
	| "editClient"
	| "confirmDeleteClient"
	| "createEmployee"
	| "editEmployee"
	| "confirmDeleteEmployee"
	| null

type DialogRegistry = {
	[key: string]: React.ReactElement
}

type DialogContextType = {
	activeDialog: DialogId
	dialogProps: Record<string, any> | null
	openDialog: (dialog: DialogId, props?: Record<string, any>) => void
	closeDialog: () => void
}

interface DialogProviderProps {
	children: React.ReactNode
	registry: DialogRegistry
}

export const DialogContext = createContext<DialogContextType | undefined>(
	undefined
)

export const DialogProvider = ({ children, registry }: DialogProviderProps) => {
	const [activeDialog, setActiveDialog] = useState<DialogId>(null)
	const [dialogProps, setDialogProps] = useState<Record<string, any> | null>(
		null
	)

	const openDialog = (dialog: DialogId, props: Record<string, any> = {}) => {
		setActiveDialog(dialog)
		setDialogProps(props)
	}

	const closeDialog = () => {
		setActiveDialog(null)
		setDialogProps(null)
	}

	const renderedDialog =
		activeDialog && registry[activeDialog]
			? cloneElement(registry[activeDialog], {
					...dialogProps,
					key: activeDialog,
				})
			: null

	return (
		<DialogContext.Provider
			value={{ activeDialog, dialogProps, openDialog, closeDialog }}
		>
			{children}
			{renderedDialog}
		</DialogContext.Provider>
	)
}
