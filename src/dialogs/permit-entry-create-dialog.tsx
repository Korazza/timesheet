"use client"

import { useTranslations } from "next-intl"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { PermitEntryCreateForm } from "@/forms/permit-entry-create-form"
import { useDialog } from "@/hooks/use-dialog"

interface PermitEntryCreatedialogProps {
	date?: Date
}

export function PermitEntryCreateDialog({
	date,
}: PermitEntryCreatedialogProps) {
	const { activeDialog, closeDialog } = useDialog()
	const t = useTranslations("Dialog.Permit")

	return (
		<Dialog
			open={activeDialog === "createPermitEntry"}
			onOpenChange={(open) => !open && closeDialog()}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("createTitle")}</DialogTitle>
				</DialogHeader>
				<PermitEntryCreateForm date={date} />
			</DialogContent>
		</Dialog>
	)
}
