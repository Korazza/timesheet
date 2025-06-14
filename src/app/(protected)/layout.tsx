import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { getEmployee } from "@/actions/employees"
import { Toaster } from "@/components/ui/sonner"
import { UserProvider } from "@/contexts/user-context"
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

	return (
		<UserProvider employee={employee}>
			<DialogProvider>
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset>
						<div className="flex flex-col-reverse md:flex-col flex-1">
							<SiteHeader />
							<NextIntlClientProvider>{children}</NextIntlClientProvider>
						</div>
						<Toaster />
					</SidebarInset>
				</SidebarProvider>
			</DialogProvider>
		</UserProvider>
	)
}
