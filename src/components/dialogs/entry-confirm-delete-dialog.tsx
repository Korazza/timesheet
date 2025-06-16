import { toast } from "sonner"

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
import { Entry } from "@/db/schema"
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

	if (!entry) return null

	return (
		<AlertDialog open={activeDialog === "confirmDeleteEntry"}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Sei veramente sicuro?</AlertDialogTitle>
					<AlertDialogDescription>
						Questa azione non può essere annullata.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={closeDialog}>Annulla</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							await deleteEntry(entry.id)
							setEntries((prev) => prev.filter((e) => e.id !== entry.id))
							closeDialog()

							const deleteMessage = {
								WORK: "Attività eliminata con successo",
								HOLIDAY: "Ferie eliminata con successo",
								PERMIT: "Permesso eliminato con successo",
								SICK: "Malattia eliminata con successo",
							}[entry.type]

							toast.success(deleteMessage)
						}}
					>
						Conferma
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
