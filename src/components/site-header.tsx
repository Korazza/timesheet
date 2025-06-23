"use client"

import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { NAVIGATION_ITEMS } from "@/lib/navigation"

function getPageTitle(
	pathname: string | null,
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
		<header className="sticky bottom-0 z-50 flex h-12 shrink-0 items-center gap-2 border-t saturate-150 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10 md:top-0 md:h-10 md:border-b">
			<div className="flex w-full items-center justify-between gap-1 px-4 md:justify-start">
				<SidebarTrigger className="-ml-1 size-6 md:size-5" />
				<Separator
					orientation="vertical"
					className="mx-2 hidden data-[orientation=vertical]:h-4 md:block"
				/>
				<h1 className="scroll-m-20 text-2xl font-semibold tracking-tight md:text-xl">
					{title}
				</h1>
				<div className="ml-0 flex items-center gap-2 md:ml-auto">
					<ThemeSwitcher className="size-6 md:size-5" />
				</div>
			</div>
		</header>
	)
}
