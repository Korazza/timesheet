"use client"

import { useTranslations } from "next-intl"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { EmployeeCreateForm } from "@/components/forms/employee-create-form"
import { useDialog } from "@/hooks/use-dialog"

export function EmployeeCreateDialog() {
	const { activeDialog, closeDialog } = useDialog()
	const t = useTranslations("Dialog.Employee")

	return (
		<Dialog
			open={activeDialog === "createEmployee"}
			onOpenChange={(open) => !open && closeDialog()}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("createTitle")}</DialogTitle>
				</DialogHeader>
				<EmployeeCreateForm />
			</DialogContent>
		</Dialog>
	)
}
