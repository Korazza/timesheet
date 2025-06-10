"use client"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { WorkingEntryCreateForm } from "@/components/forms/working-entry-create-form"
import { useDialog } from "@/hooks/use-dialog"

export function WorkingEntryCreateDialog() {
	const { activeDialog, closeDialog } = useDialog()

	return (
		<Dialog
			open={activeDialog === "createEntry"}
			onOpenChange={(open) => !open && closeDialog()}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Aggiungi attività</DialogTitle>
				</DialogHeader>
				<WorkingEntryCreateForm />
			</DialogContent>
		</Dialog>
	)
}
