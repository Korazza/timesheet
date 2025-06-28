import { Calendar, LayoutDashboard, Handshake, Users } from "lucide-react"
import type { NavigationItem } from "@/types"

export const NAVIGATION_ITEMS: NavigationItem[] = [
	{
		key: "dashboard",
		icon: LayoutDashboard,
		url: "/",
	},
	{
		key: "entries",
		icon: Calendar,
		url: "/entries",
	},
	{
		key: "clients",
		icon: Handshake,
		url: "/client",
	},
	{
		key: "employees",
		icon: Users,
		url: "/employees",
		adminOnly: true,
	},
] as const
