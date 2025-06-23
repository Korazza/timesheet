import { Calendar, LayoutDashboard, Users } from "lucide-react"
import type { NavigationItem } from "@/types"

export const NAVIGATION_ITEMS: NavigationItem[] = [
	{
		key: "dashboard",
		url: "/",
		icon: LayoutDashboard,
	},
	{
		key: "entries",
		icon: Calendar,
		url: "/entries",
		items: [
			{ key: "activities", url: "/activity" },
			{ key: "holidays", url: "/holiday" },
			{ key: "permits", url: "/permit" },
			{ key: "sick", url: "/sick" },
		],
	},
	{
		key: "clients",
		url: "/client",
		icon: Users,
	},
	{
		key: "employees",
		url: "/employees",
		icon: Users,
		adminOnly: true,
	},
] as const
