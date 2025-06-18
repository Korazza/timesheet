import { Calendar, LayoutDashboard, LucideIcon, Users } from "lucide-react";

export type NavigationItem = {
	key: string;
	url: string;
	icon: LucideIcon;
	items?: { key: string; url: string }[];
};

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
] as const;
