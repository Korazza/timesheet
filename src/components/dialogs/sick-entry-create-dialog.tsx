"use client"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { SickEntryCreateForm } from "@/components/forms/sick-entry-create-form"
import { useDialog } from "@/hooks/use-dialog"

interface SickEntryCreateDialogProps {
	date?: Date
}

export function SickEntryCreateDialog({ date }: SickEntryCreateDialogProps) {
	const { activeDialog, closeDialog } = useDialog()

	return (
		<Dialog
			open={activeDialog === "createSickEntry"}
			onOpenChange={(open) => !open && closeDialog()}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Aggiungi malattia</DialogTitle>
				</DialogHeader>
				<SickEntryCreateForm date={date} />
			</DialogContent>
		</Dialog>
	)
}
