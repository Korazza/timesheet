"use client"

import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDialog } from "@/hooks/use-dialog"
import { Employee } from "@/types"
import { deleteEmployee } from "@/actions/employees"

interface EmployeeConfirmDeleteDialogProps {
	employee?: Employee | null
}

export function EmployeeConfirmDeleteDialog({
	employee,
}: EmployeeConfirmDeleteDialogProps) {
	const { activeDialog, closeDialog } = useDialog()
	const t = useTranslations("Dialog.EmployeeDelete")
	const router = useRouter()

	if (!employee) return null

	return (
		<AlertDialog open={activeDialog === "confirmDeleteEmployee"}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t("title")}</AlertDialogTitle>
					<AlertDialogDescription>{t("description")}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={closeDialog}>
						{t("cancel")}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							await deleteEmployee(employee.id)
							closeDialog()
							router.refresh()
							toast.success(t("success"))
						}}
					>
						{t("confirm")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
