"use client"

import * as React from "react"
import {
	Clock,
	GalleryVerticalEnd,
	LayoutDashboard,
	UserCog,
	Users,
} from "lucide-react"

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
import Link from "next/link"

const navMainItems: NavMainItem[] = [
	{
		title: "Dashboard",
		url: "/",
		icon: LayoutDashboard,
	},
	{
		title: "Consuntivazioni",
		icon: Clock,
		items: [
			{
				title: "Attività",
				url: "/activity",
			},
			{
				title: "Ferie",
				url: "/holiday",
			},
			{
				title: "Permessi",
				url: "/permit",
			},
			{
				title: "Malattia",
				url: "/sick",
			},
		],
	},
	{
		title: "Clienti",
		url: "/client",
		icon: Users,
	},
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<Link href="/">
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
							>
								<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									<GalleryVerticalEnd className="size-4" />
								</div>
								<span className="font-medium">Assertcode</span>
							</SidebarMenuButton>
						</Link>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<NavMain navItems={navMainItems} />
			</SidebarContent>

			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	)
}
