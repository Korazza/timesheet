"use client"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Entry } from "@/db/schema"
import { EntryUpdateForm } from "@/components/forms/entry-update-form"

interface EntryUpdateDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	entry: Entry | null
}

export function EntryUpdateDialog({
	open,
	onOpenChange,
	entry,
}: EntryUpdateDialogProps) {
	if (!entry) return null

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Modifica Consuntivazione</DialogTitle>
				</DialogHeader>
				<EntryUpdateForm entry={entry} />
			</DialogContent>
		</Dialog>
	)
}
