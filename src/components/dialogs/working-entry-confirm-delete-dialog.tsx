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

interface WorkingEntryConfirmDeleteDialogProps {
	entry: Entry | null
}

export function WorkingEntryConfirmDeleteDialog({
	entry,
}: WorkingEntryConfirmDeleteDialogProps) {
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
						}}
					>
						Conferma
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
