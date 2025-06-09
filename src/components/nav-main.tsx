"use client"

import { usePathname } from "next/navigation"
import { type LucideIcon } from "lucide-react"

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"

export type NavMainItem = {
	title: string
	url: string
	icon: LucideIcon
}

export function NavMain({ items }: { items: NavMainItem[] }) {
	const pathname = usePathname()

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Timesheet</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => {
						const isActive = pathname === item.url

						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild isActive={isActive}>
									<a href={item.url}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						)
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
