"use client"

import { toast } from "sonner"
import { useTranslations } from "next-intl"

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
import { Entry } from "@/types"
import { deleteEntry } from "@/actions/entries"
import { useEntries } from "@/hooks/use-entries"

interface EntryConfirmDeleteDialogProps {
	entry?: Entry | null
}

export function EntryConfirmDeleteDialog({
	entry,
}: EntryConfirmDeleteDialogProps) {
	const { activeDialog, closeDialog } = useDialog()
	const { setEntries } = useEntries()
	const t = useTranslations("Dialog.EntryDelete")

	if (!entry) return null

	return (
		<AlertDialog open={activeDialog === "confirmDeleteEntry"}>
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
							await deleteEntry(entry.id)
							setEntries((prev) => prev.filter((e) => e.id !== entry.id))
							closeDialog()

							const deleteMessage = {
								WORK: t("success.work"),
								HOLIDAY: t("success.holiday"),
								PERMIT: t("success.permit"),
								SICK: t("success.sick"),
							}[entry.type]

							toast.success(deleteMessage)
						}}
					>
						{t("confirm")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
