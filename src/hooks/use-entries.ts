import { useContext } from "react"

import { EntryContext } from "@/contexts/entry-context"

export const useEntries = () => {
	const context = useContext(EntryContext)
	if (!context) throw new Error("useEntries must be used within EntryProvider")
	return context
}
