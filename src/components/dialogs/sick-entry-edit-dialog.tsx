"use client"

import { useTranslations } from "next-intl"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { useDialog } from "@/hooks/use-dialog"
import { SickEntryEditForm } from "@/components/forms/sick-entry-edit-form"
import { Entry } from "@/types"

interface SickEntryEditDialogProps {
	entry?: Entry | null
}

export function SickEntryEditDialog({ entry }: SickEntryEditDialogProps) {
	const { activeDialog, closeDialog } = useDialog()
	const t = useTranslations("Dialog.Sick")

	if (!entry) return null

	return (
		<Dialog
			open={activeDialog === "editSickEntry"}
			onOpenChange={(open) => !open && closeDialog()}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("editTitle")}</DialogTitle>
				</DialogHeader>
				<SickEntryEditForm entry={entry} />
			</DialogContent>
		</Dialog>
	)
}
