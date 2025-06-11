"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Check } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"

export function ThemeSwitcher() {
	const { setTheme, theme, resolvedTheme } = useTheme()
	const [isMounted, setIsMounted] = React.useState(false)

	React.useEffect(() => {
		setIsMounted(true)
	}, [])

	const currentThemeLabel =
		theme === "system"
			? `Tema di sistema (${resolvedTheme === "light" ? "chiaro" : "scuro"})`
			: resolvedTheme === "light"
			? "Tema chiaro"
			: "Tema scuro"

	const icon =
		resolvedTheme === "light" ? (
			<Sun className="h-[1.2rem] w-[1.2rem]" />
		) : (
			<Moon className="h-[1.2rem] w-[1.2rem]" />
		)

	const isSelected = (value: string) => theme === value

	return (
		<Tooltip>
			<DropdownMenu>
				<TooltipTrigger asChild>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							{isMounted && icon}
							<span className="sr-only">Cambia tema</span>
						</Button>
					</DropdownMenuTrigger>
				</TooltipTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => setTheme("light")}>
						<Sun className="mr-2 h-4 w-4" />
						Chiaro
						{isSelected("light") && <Check className="ml-auto h-4 w-4" />}
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme("dark")}>
						<Moon className="mr-2 h-4 w-4" />
						Scuro
						{isSelected("dark") && <Check className="ml-auto h-4 w-4" />}
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme("system")}>
						<Monitor className="mr-2 h-4 w-4" />
						Sistema{" "}
						{theme === "system" && (
							<span className="ml-1 text-muted-foreground text-xs">
								({resolvedTheme === "light" ? "chiaro" : "scuro"})
							</span>
						)}
						{isSelected("system") && <Check className="ml-auto h-4 w-4" />}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<TooltipContent side="bottom">
				<span>{currentThemeLabel}</span>
			</TooltipContent>
		</Tooltip>
	)
}
