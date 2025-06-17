import { Clock, LayoutDashboard, LucideIcon, Users } from "lucide-react"

export type NavigationItem = {
	title: string
	url: string
	icon: LucideIcon
	items?: { title: string; url: string }[]
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
	{
		title: "Dashboard",
		url: "/",
		icon: LayoutDashboard,
	},
	{
		title: "Consuntivazioni",
		icon: Clock,
		url: "/entries",
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
] as const
