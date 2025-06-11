import { getClients } from "@/actions/clients"
import { getEmployee } from "@/actions/employees"
import { getEntries } from "@/actions/entries"
import { ClientProvider } from "@/contexts/client-context"
import { EntryProvider } from "@/contexts/entry-context"

export default async function DataLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const employee = await getEmployee()

	if (!employee) return null

	const [clients, entries] = await Promise.all([
		getClients(),
		getEntries(employee.id),
	])

	return (
		<ClientProvider initialClients={clients}>
			<EntryProvider initialEntries={entries}>{children}</EntryProvider>
		</ClientProvider>
	)
}
