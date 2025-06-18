"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { NAVIGATION_ITEMS } from "@/lib/navigation"

export function NavMain() {
	const pathname = usePathname()
	const t = useTranslations("Sidebar")

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Timesheet</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{NAVIGATION_ITEMS.map((item) => (
						<SidebarMenuItem key={item.url}>
							<SidebarMenuButton asChild isActive={item.url === pathname}>
								<Link href={item.url}>
									<item.icon />
									<span>{t(item.key)}</span>
								</Link>
							</SidebarMenuButton>
							{item.items && item.items.length ? (
								<SidebarMenuSub>
									{item.items.map((subItem) => (
										<SidebarMenuSubItem key={subItem.url}>
											<SidebarMenuSubButton
												asChild
												isActive={subItem.url === pathname}
											>
												<Link href={subItem.url}>{t(subItem.key)}</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							) : null}
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
