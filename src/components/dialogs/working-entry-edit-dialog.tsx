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
import { useTranslations } from "next-intl"

interface WorkingEntryEditDialogProps {
	entry?: Entry | null
}

export function WorkingEntryEditDialog({ entry }: WorkingEntryEditDialogProps) {
	const { activeDialog, closeDialog } = useDialog()
	const t = useTranslations("Dialog.Working")

	if (!entry) return null

	return (
		<Dialog
			open={activeDialog === "editWorkingEntry"}
			onOpenChange={(open) => !open && closeDialog()}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("editTitle")}</DialogTitle>
				</DialogHeader>
				<WorkingEntryEditForm entry={entry} />
			</DialogContent>
		</Dialog>
	)
}
