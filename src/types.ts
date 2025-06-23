import type { LucideIcon } from "lucide-react"

import type {
	activityTypeEnum,
	clientsTable,
	employeesTable,
	entriesTable,
	entryTypeEnum,
	roleEnum,
} from "@/db/schema"

export type Role = (typeof roleEnum.enumValues)[number]

export type EntryType = (typeof entryTypeEnum.enumValues)[number]

export type ActivityType = (typeof activityTypeEnum.enumValues)[number]

export type Employee = typeof employeesTable.$inferSelect
export type EmployeeWithAvatar = Employee & { avatarUrl?: string }

export type Client = typeof clientsTable.$inferSelect

export type Entry = typeof entriesTable.$inferSelect
export type EntryWithClient = Entry & { client?: Client | null }

export type NavigationItem = {
	key: string
	url: string
	icon: LucideIcon
	items?: { key: string; url: string }[]
	adminOnly?: boolean
}
