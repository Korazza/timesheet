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
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) sticky bottom-0 md:top-0 saturate-150 backdrop-blur-xl z-10">
			<div className="flex w-full items-center justify-between md:justify-start gap-1 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4 hidden md:block"
				/>
				<h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
					{title}
				</h1>
				<div className="ml-0 md:ml-auto flex items-center gap-2">
					<ThemeSwitcher />
				</div>
			</div>
		</header>
	)
}
