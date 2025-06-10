import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { getEmployee } from "@/actions/employees"
import { Toaster } from "@/components/ui/sonner"
import { getClients } from "@/actions/clients"
import { getEntries } from "@/actions/entries"
import { UserProvider } from "@/contexts/user-context"
import { ClientProvider } from "@/contexts/client-context"
import { EntryProvider } from "@/contexts/entry-context"
import { DialogProvider } from "@/contexts/dialog-context"
import "../globals.css"

export const metadata: Metadata = {
	title: "Timesheet",
	description: "Assertcode Timesheet",
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const employee = await getEmployee()

	if (!employee) {
		redirect("/denied")
	}

	const entriesPromise = getEntries(employee.id)
	const clientsPromise = getClients()

	const [entries, clients] = await Promise.all([entriesPromise, clientsPromise])

	return (
		<UserProvider employee={employee}>
			<EntryProvider initialEntries={entries}>
				<ClientProvider initialClients={clients}>
					<DialogProvider>
						<SidebarProvider>
							<AppSidebar />
							<SidebarInset>
								<SiteHeader />
								<NextIntlClientProvider>{children}</NextIntlClientProvider>
								<Toaster />
							</SidebarInset>
						</SidebarProvider>
					</DialogProvider>
				</ClientProvider>
			</EntryProvider>
		</UserProvider>
	)
}
