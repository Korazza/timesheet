"use client"

import { createContext, useMemo, useState } from "react"
import type { EntryWithClient } from "@/db/schema"

type EntryContextType = {
	entries: EntryWithClient[]
	setEntries: React.Dispatch<React.SetStateAction<EntryWithClient[]>>
	workingEntries: EntryWithClient[]
	holidayEntries: EntryWithClient[]
	permitEntries: EntryWithClient[]
	sickEntries: EntryWithClient[]
}

export const EntryContext = createContext<EntryContextType | undefined>(
	undefined
)

export const EntryProvider = ({
	children,
	initialEntries,
}: {
	children: React.ReactNode
	initialEntries: EntryWithClient[]
}) => {
	const [entries, setEntries] = useState<EntryWithClient[]>(initialEntries)

	const workingEntries = useMemo(
		() => entries.filter((e) => e.type === "WORK"),
		[entries]
	)
	const holidayEntries = useMemo(
		() => entries.filter((e) => e.type === "HOLIDAY"),
		[entries]
	)
	const permitEntries = useMemo(
		() => entries.filter((e) => e.type === "PERMIT"),
		[entries]
	)
	const sickEntries = useMemo(
		() => entries.filter((e) => e.type === "SICK"),
		[entries]
	)

	return (
		<EntryContext.Provider
			value={{
				entries,
				setEntries,
				workingEntries,
				holidayEntries,
				permitEntries,
				sickEntries,
			}}
		>
			{children}
		</EntryContext.Provider>
	)
}
