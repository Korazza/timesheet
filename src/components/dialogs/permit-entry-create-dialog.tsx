"use client"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { PermitEntryCreateForm } from "@/components/forms/permit-entry-create-form"
import { useDialog } from "@/hooks/use-dialog"

interface PermitEntryCreatedialogProps {
	date?: Date
}

export function PermitEntryCreateDialog({
	date,
}: PermitEntryCreatedialogProps) {
	const { activeDialog, closeDialog } = useDialog()

	return (
		<Dialog
			open={activeDialog === "createPermitEntry"}
			onOpenChange={(open) => !open && closeDialog()}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Aggiungi ferie</DialogTitle>
				</DialogHeader>
				<PermitEntryCreateForm date={date} />
			</DialogContent>
		</Dialog>
	)
}
