import { NextIntlClientProvider } from "next-intl"
import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { getEmployee } from "@/actions/employees"
import { Toaster } from "@/components/ui/sonner"
import { UserProvider } from "@/contexts/user-context"
import "../globals.css"

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
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<div className="flex flex-1 flex-col-reverse md:flex-col">
						<SiteHeader />
						<NextIntlClientProvider>{children}</NextIntlClientProvider>
					</div>
					<Toaster />
				</SidebarInset>
			</SidebarProvider>
		</UserProvider>
	)
}
