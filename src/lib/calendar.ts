import {
	addDays,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isWeekend,
	startOfMonth,
	startOfWeek,
	subDays,
} from "date-fns"

const holidayCache: Record<number, Set<string>> = {}

export function getItalianHolidays(year: number): Date[] {
	const fixed = [
		new Date(year, 0, 1), // 1 gennaio
		new Date(year, 0, 6), // Epifania
		new Date(year, 3, 25), // 25 aprile
		new Date(year, 4, 1), // 1 maggio
		new Date(year, 5, 2), // 2 giugno
		new Date(year, 7, 15), // 15 agosto
		new Date(year, 10, 1), // 1 novembre
		new Date(year, 11, 8), // 8 dicembre
		new Date(year, 11, 25), // Natale
		new Date(year, 11, 26), // Santo Stefano
	]

	const easter = getEasterDate(year)
	const easterMonday = new Date(easter.getTime() + 24 * 60 * 60 * 1000)

	return [...fixed, easter, easterMonday]
}

function getEasterDate(year: number): Date {
	const f = Math.floor
	const G = year % 19
	const C = f(year / 100)
	const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30
	const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11))
	const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7
	const L = I - J
	const month = 3 + f((L + 40) / 44)
	const day = L + 28 - 31 * f(month / 4)
	return new Date(year, month - 1, day)
}

export function dateKey(d: Date): string {
	return format(d, "yyyy-MM-dd")
}

export function getHolidaySet(year: number): Set<string> {
	if (!holidayCache[year]) {
		holidayCache[year] = new Set(getItalianHolidays(year).map(dateKey))
	}
	return holidayCache[year]
}

export function subWorkingDays(
	date: Date,
	workingDaysToSubtract: number
): Date {
	let currentDate = new Date(date)
	let remaining = workingDaysToSubtract

	while (remaining > 0) {
		currentDate = subDays(currentDate, 1)
		const year = currentDate.getFullYear()
		const isHoliday = getHolidaySet(year).has(dateKey(currentDate))
		if (!isWeekend(currentDate) && !isHoliday) {
			remaining--
		}
	}

	return currentDate
}

export function getCalendarMatrix(date: Date) {
	const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 })
	const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 })

	const days: Date[] = []
	let current = start

	while (current <= end) {
		days.push(current)
		current = addDays(current, 1)
	}

	return days
}

export function getWeekDays(date: Date) {
	const start = startOfWeek(date, { weekStartsOn: 1 })
	return eachDayOfInterval({ start, end: addDays(start, 6) })
}

export function getDayView(date: Date) {
	return [date]
}
