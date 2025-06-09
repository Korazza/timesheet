"use client"

import * as React from "react"
import { Clock, LayoutDashboard, UserCog, Users } from "lucide-react"

import { NavMain, type NavMainItem } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"

const user = {
	firstName: "Roberto",
	lastName: "Coratti",
	email: "roberto.coratti@assertcode.it",
}

const navMainItems: NavMainItem[] = [
	{
		title: "Dashboard",
		url: "/",
		icon: LayoutDashboard,
	},
	{
		title: "Consuntivazioni",
		url: "/entries",
		icon: Clock,
	},
	{
		title: "Clienti",
		url: "#",
		icon: Users,
	},
	{
		title: "Dipendenti",
		url: "#",
		icon: UserCog,
	},
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<a href="/">
								<span className="text-base font-semibold">Assertcode</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<NavMain items={navMainItems} />
			</SidebarContent>

			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	)
}
