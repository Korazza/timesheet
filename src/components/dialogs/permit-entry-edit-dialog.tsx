"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Entry } from "@/db/schema"
import { useDialog } from "@/hooks/use-dialog"
import { PermitEntryEditForm } from "@/components/forms/permit-entry-edit-form"

interface PermitEntryEditDialogProps {
  entry?: Entry | null
}

export function PermitEntryEditDialog({ entry }: PermitEntryEditDialogProps) {
  const { activeDialog, closeDialog } = useDialog()

  if (!entry) return null

  return (
    <Dialog
      open={activeDialog === "editPermitEntry"}
      onOpenChange={(open) => !open && closeDialog()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifica ferie</DialogTitle>
        </DialogHeader>
        <PermitEntryEditForm entry={entry} />
      </DialogContent>
    </Dialog>
  )
}
