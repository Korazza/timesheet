"use client"

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

	return (
		<Dialog
			open={activeDialog === "createClient"}
			onOpenChange={(open) => !open && closeDialog()}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Aggiungi cliente</DialogTitle>
				</DialogHeader>
				<ClientCreateForm />
			</DialogContent>
		</Dialog>
	)
}
