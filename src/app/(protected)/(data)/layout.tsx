import { getClients } from "@/actions/clients"
import { getEntries } from "@/actions/entries"
import { EntryConfirmDeleteDialog } from "@/dialogs/entry-confirm-delete-dialog"
import { HolidayEntryCreateDialog } from "@/dialogs/holiday-entry-create-dialog"
import { HolidayEntryEditDialog } from "@/dialogs/holiday-entry-edit-dialog"
import { PermitEntryCreateDialog } from "@/dialogs/permit-entry-create-dialog"
import { PermitEntryEditDialog } from "@/dialogs/permit-entry-edit-dialog"
import { SickEntryCreateDialog } from "@/dialogs/sick-entry-create-dialog"
import { SickEntryEditDialog } from "@/dialogs/sick-entry-edit-dialog"
import { WorkingEntryCreateDialog } from "@/dialogs/working-entry-create-dialog"
import { WorkingEntryEditDialog } from "@/dialogs/working-entry-edit-dialog"
import { EmployeeCreateDialog } from "@/dialogs/employee-create-dialog"
import { EmployeeEditDialog } from "@/dialogs/employee-edit-dialog"
import { EmployeeConfirmDeleteDialog } from "@/dialogs/employee-confirm-delete-dialog"
import { ClientProvider } from "@/contexts/client-context"
import { DialogProvider } from "@/contexts/dialog-context"
import { EntryProvider } from "@/contexts/entry-context"

export default async function DataLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const [clients, entries] = await Promise.all([getClients(), getEntries()])

	return (
		<ClientProvider initialClients={clients}>
			<EntryProvider initialEntries={entries}>
				<DialogProvider
					registry={{
						createHolidayEntry: <HolidayEntryCreateDialog />,
						editHolidayEntry: <HolidayEntryEditDialog />,
						createPermitEntry: <PermitEntryCreateDialog />,
						editPermitEntry: <PermitEntryEditDialog />,
						createSickEntry: <SickEntryCreateDialog />,
						editSickEntry: <SickEntryEditDialog />,
						createWorkingEntry: <WorkingEntryCreateDialog />,
						editWorkingEntry: <WorkingEntryEditDialog />,
						confirmDeleteEntry: <EntryConfirmDeleteDialog />,
						createEmployee: <EmployeeCreateDialog />,
						editEmployee: <EmployeeEditDialog />,
						confirmDeleteEmployee: <EmployeeConfirmDeleteDialog />,
					}}
				>
					{children}
				</DialogProvider>
			</EntryProvider>
		</ClientProvider>
	)
}
