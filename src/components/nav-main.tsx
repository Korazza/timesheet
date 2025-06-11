"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, type LucideIcon } from "lucide-react"

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
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"

export type NavMainItem = {
	title: string
	url?: string
	icon: LucideIcon
	items?: { title: string; url: string }[]
}

export function NavMain({ navItems }: { navItems: NavMainItem[] }) {
	const pathname = usePathname()

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Timesheet</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{navItems.map((item) => {
						const isActive =
							item.url === pathname ||
							item.items?.some((i) => i.url === pathname)

						return item.url && !item.items ? (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild isActive={isActive}>
									<Link href={item.url}>
										<item.icon />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						) : (
							<Collapsible
								key={item.title}
								asChild
								defaultOpen={isActive}
								className="group/collapsible"
							>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={item.title}>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.items?.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton
														asChild
														isActive={subItem.url === pathname}
													>
														<Link href={subItem.url}>
															<span>{subItem.title}</span>
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						)
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
