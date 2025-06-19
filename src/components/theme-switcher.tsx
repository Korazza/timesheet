"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeSwitcher() {
	const t = useTranslations("ThemeSwitcher")
	const { setTheme, theme, resolvedTheme } = useTheme()
	const [isMounted, setIsMounted] = React.useState(false)

	React.useEffect(() => {
		setIsMounted(true)
	}, [])

	const currentThemeLabel =
		theme === "system"
			? t("systemLabel", {
					mode: t(resolvedTheme === "light" ? "light" : "dark"),
				})
			: t(resolvedTheme === "light" ? "lightLabel" : "darkLabel")

	const icon =
		resolvedTheme === "light" ? (
			<Sun className="h-[1.2rem] w-[1.2rem]" />
		) : (
			<Moon className="h-[1.2rem] w-[1.2rem]" />
		)

	const isSelected = (value: string) => theme === value

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					aria-label={currentThemeLabel}
					title={currentThemeLabel}
					suppressHydrationWarning
				>
					{isMounted && icon}
					<span className="sr-only">{t("changeTheme")}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					<Sun className="mr-2 h-4 w-4" />
					{t("light")}
					{isSelected("light") && <Check className="ml-auto h-4 w-4" />}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					<Moon className="mr-2 h-4 w-4" />
					{t("dark")}
					{isSelected("dark") && <Check className="ml-auto h-4 w-4" />}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					<Monitor className="mr-2 h-4 w-4" />
					{t("system")}{" "}
					{theme === "system" && (
						<span className="text-muted-foreground ml-1 text-xs">
							({t(resolvedTheme === "light" ? "light" : "dark")})
						</span>
					)}
					{isSelected("system") && <Check className="ml-auto h-4 w-4" />}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
