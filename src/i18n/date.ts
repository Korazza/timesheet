import { Locale, setDefaultOptions } from "date-fns"
import { it, enGB } from "date-fns/locale"

const LOCALE_MAP: Record<string, Locale> = {
	it,
	en: enGB,
}

export function configureDateFns(localeCode: string) {
	const locale = localeCode in LOCALE_MAP ? LOCALE_MAP[localeCode] : it
	setDefaultOptions({ locale })
}
