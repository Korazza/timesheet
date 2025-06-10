"use client"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Entry } from "@/db/schema"
import { WorkingEntryEditForm } from "@/components/forms/working-entry-edit-form"
import { useDialog } from "@/hooks/use-dialog"

interface WorkingEntryEditDialogProps {
	entry: Entry | null
}

export function WorkingEntryEditDialog({ entry }: WorkingEntryEditDialogProps) {
	const { activeDialog, closeDialog } = useDialog()

	if (!entry) return null

	return (
		<Dialog
			open={activeDialog === "editEntry"}
			onOpenChange={(open) => !open && closeDialog()}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Modifica attività</DialogTitle>
				</DialogHeader>
				<WorkingEntryEditForm entry={entry} />
			</DialogContent>
		</Dialog>
	)
}
