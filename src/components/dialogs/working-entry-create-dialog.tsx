"use client"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { WorkingEntryCreateForm } from "@/components/forms/working-entry-create-form"
import { useDialog } from "@/hooks/use-dialog"

interface WorkingEntryCreateDialogProps {
	date?: Date
}

export function WorkingEntryCreateDialog({
	date,
}: WorkingEntryCreateDialogProps) {
	const { activeDialog, closeDialog } = useDialog()

	return (
		<Dialog
			open={activeDialog === "createWorkingEntry"}
			onOpenChange={(open) => !open && closeDialog()}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Aggiungi attività</DialogTitle>
				</DialogHeader>
				<WorkingEntryCreateForm date={date} />
			</DialogContent>
		</Dialog>
	)
}
