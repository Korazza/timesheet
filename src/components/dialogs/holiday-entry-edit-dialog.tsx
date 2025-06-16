"use client"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Entry } from "@/db/schema"
import { useDialog } from "@/hooks/use-dialog"
import { HolidayEntryEditForm } from "@/components/forms/holiday-entry-edit-form"

interface HolidayEntryEditDialogProps {
	entry?: Entry | null
}

export function HolidayEntryEditDialog({ entry }: HolidayEntryEditDialogProps) {
	const { activeDialog, closeDialog } = useDialog()

	if (!entry) return null

	return (
		<Dialog
			open={activeDialog === "editHolidayEntry"}
			onOpenChange={(open) => !open && closeDialog()}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Modifica ferie</DialogTitle>
				</DialogHeader>
				<HolidayEntryEditForm entry={entry} />
			</DialogContent>
		</Dialog>
	)
}
