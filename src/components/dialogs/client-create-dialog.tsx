"use client"

import { useTranslations } from "next-intl"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { ClientCreateForm } from "@/components/forms/client-create-form"
import { useDialog } from "@/hooks/use-dialog"

export function ClientCreateDialog() {
	const { activeDialog, closeDialog } = useDialog()
	const t = useTranslations("Dialog.Client")

	return (
		<Dialog
			open={activeDialog === "createClient"}
			onOpenChange={(open) => !open && closeDialog()}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("createTitle")}</DialogTitle>
				</DialogHeader>
				<ClientCreateForm />
			</DialogContent>
		</Dialog>
	)
}
