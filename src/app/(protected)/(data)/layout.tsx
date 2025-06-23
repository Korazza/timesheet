import { getClients } from "@/actions/clients"
import { getEntries } from "@/actions/entries"
import { EntryConfirmDeleteDialog } from "@/components/dialogs/entry-confirm-delete-dialog"
import { HolidayEntryCreateDialog } from "@/components/dialogs/holiday-entry-create-dialog"
import { HolidayEntryEditDialog } from "@/components/dialogs/holiday-entry-edit-dialog"
import { PermitEntryCreateDialog } from "@/components/dialogs/permit-entry-create-dialog"
import { PermitEntryEditDialog } from "@/components/dialogs/permit-entry-edit-dialog"
import { SickEntryCreateDialog } from "@/components/dialogs/sick-entry-create-dialog"
import { SickEntryEditDialog } from "@/components/dialogs/sick-entry-edit-dialog"
import { WorkingEntryCreateDialog } from "@/components/dialogs/working-entry-create-dialog"
import { WorkingEntryEditDialog } from "@/components/dialogs/working-entry-edit-dialog"
import { EmployeeCreateDialog } from "@/components/dialogs/employee-create-dialog"
import { EmployeeEditDialog } from "@/components/dialogs/employee-edit-dialog"
import { EmployeeConfirmDeleteDialog } from "@/components/dialogs/employee-confirm-delete-dialog"
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
