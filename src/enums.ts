import { ActivityType, EntryType, Role } from "@/db/schema"
import { useTranslations } from "next-intl"

// HOOK per ottenere le opzioni tradotte
export function useEnumOptions() {
	const t = useTranslations("Enums")
	const roleOptions = [
		{ label: t("role.employee"), value: "EMPLOYEE" },
		{ label: t("role.admin"), value: "ADMIN" },
	]
	const entryTypeOptions = [
		{ label: t("entryType.work"), value: "WORK" },
		{ label: t("entryType.holiday"), value: "HOLIDAY" },
		{ label: t("entryType.permit"), value: "PERMIT" },
		{ label: t("entryType.sick"), value: "SICK" },
	]
	const activityTypeOptions = [
		{ label: t("activityType.project"), value: "PROJECT" },
		{ label: t("activityType.task"), value: "TASK" },
		{ label: t("activityType.ams"), value: "AMS" },
	]
	return { roleOptions, entryTypeOptions, activityTypeOptions }
}
