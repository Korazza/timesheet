"use client"

import { useTranslations } from "next-intl"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { HolidayEntryCreateForm } from "@/components/forms/holiday-entry-create-form"
import { useDialog } from "@/hooks/use-dialog"

interface HolidayEntryCreateDialogProps {
	date?: Date
}

export function HolidayEntryCreateDialog({
	date,
}: HolidayEntryCreateDialogProps) {
	const { activeDialog, closeDialog } = useDialog()
	const t = useTranslations("Dialog.Holiday")

	return (
		<Dialog
			open={activeDialog === "createHolidayEntry"}
			onOpenChange={(open) => !open && closeDialog()}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("createTitle")}</DialogTitle>
				</DialogHeader>
				<HolidayEntryCreateForm date={date} />
			</DialogContent>
		</Dialog>
	)
}
