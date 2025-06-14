"use client"

import { configureDateFns } from "@/i18n/date"

export function ClientLocaleProvider({ locale }: { locale: string }) {
	configureDateFns(locale)
	return null
}
