"use client"

import { useTranslations } from "next-intl"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Client } from "@/types"
import { useDialog } from "@/hooks/use-dialog"
import { ClientEditForm } from "@/forms/client-edit-form"

interface ClientEditDialogProps {
	client?: Client | null
}

export function ClientEditDialog({ client }: ClientEditDialogProps) {
	const { activeDialog, closeDialog } = useDialog()
	const t = useTranslations("Dialog.Client")

	if (!client) return null

	return (
		<Dialog
			open={activeDialog === "editClient"}
			onOpenChange={(open) => !open && closeDialog()}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("editTitle")}</DialogTitle>
				</DialogHeader>
				<ClientEditForm client={client} />
			</DialogContent>
		</Dialog>
	)
}
