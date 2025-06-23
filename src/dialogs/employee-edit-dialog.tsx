"use client"

import { useTranslations } from "next-intl"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Employee } from "@/types"
import { useDialog } from "@/hooks/use-dialog"
import { EmployeeEditForm } from "@/forms/employee-edit-form"

interface EmployeeEditDialogProps {
	employee?: Employee | null
}

export function EmployeeEditDialog({ employee }: EmployeeEditDialogProps) {
	const { activeDialog, closeDialog } = useDialog()
	const t = useTranslations("Dialog.Employee")

	if (!employee) return null

	return (
		<Dialog
			open={activeDialog === "editEmployee"}
			onOpenChange={(open) => !open && closeDialog()}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("editTitle")}</DialogTitle>
				</DialogHeader>
				<EmployeeEditForm employee={employee} />
			</DialogContent>
		</Dialog>
	)
}
