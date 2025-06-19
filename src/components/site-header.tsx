"use client"

import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { NAVIGATION_ITEMS } from "@/lib/navigation"

function getPageTitle(
	pathname: string,
	t: (key: string) => string
): string | null {
	for (const item of NAVIGATION_ITEMS) {
		if (item.url === pathname) return t(item.key)
		const match = item.items?.find((i) => i.url === pathname)
		if (match) return t(match.key)
	}
	return null
}

export function SiteHeader() {
	const pathname = usePathname()
	const t = useTranslations("Sidebar")
	const title = getPageTitle(pathname, t)

	return (
		<header className="sticky bottom-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b saturate-150 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) md:top-0">
			<div className="flex w-full items-center justify-between gap-1 px-4 md:justify-start">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 hidden data-[orientation=vertical]:h-4 md:block"
				/>
				<h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
					{title}
				</h1>
				<div className="ml-0 flex items-center gap-2 md:ml-auto">
					<ThemeSwitcher />
				</div>
			</div>
		</header>
	)
}
