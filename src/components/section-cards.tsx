"use client"

import { useMemo } from "react"
import { isSameDay, isSameMonth } from "date-fns"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { useEntries } from "@/hooks/use-entries"
import { getItalianHolidays } from "@/lib/calendar"
import { cn } from "@/lib/utils"
import { EntryWithClient } from "@/types"

function getDailyHoursMap(entries: EntryWithClient[]) {
	const map = new Map<string, number>()
	for (const e of entries) {
		const dayKey = new Date(e.date).toDateString()
		map.set(dayKey, (map.get(dayKey) || 0) + e.hours + (e.overtimeHours ?? 0))
	}
	return map
}

function getAverage(map: Map<string, number>) {
	if (!map.size) return 0
	return Array.from(map.values()).reduce((sum, h) => sum + h, 0) / map.size
}

function getDelta(current: number, previous: number) {
	if (previous === 0) return 0
	return ((current - previous) / previous) * 100
}

export function SectionCards() {
	const t = useTranslations("SectionCards")
	const { entries } = useEntries()

	const {
		averageHoursPerDay,
		registeredWorkingDays,
		totalWorkingDays,
		totalHours,
		overtimeHours,
		deltas,
	} = useMemo(() => {
		const now = new Date()
		const year = now.getFullYear()
		const month = now.getMonth()
		const today = now.getDate()
		const holidays = getItalianHolidays(year)

		const monthEntries = entries.filter(
			(e) => e.type === "WORK" && isSameMonth(new Date(e.date), now)
		)

		const prevMonth = new Date(year, month - 1, 1)
		const prevMonthEntries = entries.filter(
			(e) => e.type === "WORK" && isSameMonth(new Date(e.date), prevMonth)
		)

		const allDays = []

		for (let day = 1; day < today; day++) {
			const date = new Date(year, month, day)
			const isWeekend = date.getDay() === 0 || date.getDay() === 6
			const isHoliday = holidays.some((h) => isSameDay(h, date))
			if (!isWeekend && !isHoliday) {
				allDays.push(date)
			}
		}

		const registeredDays = new Set(
			entries
				.map((e) => new Date(e.date))
				.filter((d) => isSameMonth(d, now))
				.map((d) => d.toDateString())
		)

		const currentMap = getDailyHoursMap(monthEntries)
		const prevMap = getDailyHoursMap(prevMonthEntries)

		const avg = getAverage(currentMap)
		const prevAvg = getAverage(prevMap)

		const currentTotal = monthEntries.reduce(
			(sum, e) => sum + e.hours + (e.overtimeHours ?? 0),
			0
		)

		const currentOvertime = monthEntries.reduce(
			(sum, e) => sum + (e.overtimeHours ?? 0),
			0
		)

		return {
			averageHoursPerDay: avg,
			registeredWorkingDays: registeredDays.size,
			totalWorkingDays: allDays.length,
			totalHours: currentTotal,
			overtimeHours: currentOvertime,
			deltas: {
				avg: getDelta(avg, prevAvg),
			},
		}
	}, [entries])

	function renderDeltaBadge(value: number) {
		const isPositive = value >= 0
		const Icon = isPositive ? TrendingUp : TrendingDown
		const sign = isPositive ? "+" : ""

		return (
			<Badge variant="outline">
				<Icon
					className={cn(
						"mr-1",
						isPositive ? "text-primary" : "text-destructive"
					)}
				/>
				{sign}
				{value.toFixed(1)}%
			</Badge>
		)
	}

	function renderDeltaLabel(value: number, field: string) {
		const isPositive = value >= 0
		const Icon = isPositive ? TrendingUp : TrendingDown
		const text = isPositive
			? t("deltaUp", { field })
			: t("deltaDown", { field })

		return (
			<div className="line-clamp-1 flex gap-2 font-medium">
				{text} <Icon className="size-4" />
			</div>
		)
	}

	return (
		<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @md/main:grid-cols-2 @2xl/main:grid-cols-4">
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>{t("averagePerDay")}</CardDescription>
					<CardTitle className="text-2xl font-semibold text-nowrap tabular-nums @[250px]/card:text-3xl">
						{averageHoursPerDay.toFixed(1)} h
					</CardTitle>
					<CardAction>{renderDeltaBadge(deltas.avg)}</CardAction>
				</CardHeader>
				<CardFooter className="hidden flex-col items-start gap-1.5 text-sm md:block">
					{renderDeltaLabel(deltas.avg, t("sinceLastMonth"))}
					<div className="text-muted-foreground">
						{t("basedOnLastDays", { n: registeredWorkingDays })}
					</div>
				</CardFooter>
			</Card>

			<Card className="@container/card">
				<CardHeader>
					<CardDescription>{t("registeredDays")}</CardDescription>
					<CardTitle className="text-2xl font-semibold text-nowrap tabular-nums @[250px]/card:text-3xl">
						{registeredWorkingDays}/{totalWorkingDays}
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							{registeredWorkingDays - totalWorkingDays}
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="hidden flex-col items-start gap-1.5 text-sm md:block">
					<div className="line-clamp-1 flex gap-2 font-medium">
						{t("daysToRegister", {
							n: totalWorkingDays - registeredWorkingDays,
						})}
					</div>
					<div className="text-muted-foreground">
						{t("registeredDaysThisMonth")}
					</div>
				</CardFooter>
			</Card>

			<Card className="@container/card">
				<CardHeader>
					<CardDescription>{t("totalHours")}</CardDescription>
					<CardTitle className="text-2xl font-semibold text-nowrap tabular-nums @[250px]/card:text-3xl">
						{totalHours} h
					</CardTitle>
				</CardHeader>
				<CardFooter className="hidden flex-col items-start gap-1.5 text-sm md:block">
					<div className="text-muted-foreground">
						{t("totalHoursThisMonth")}
					</div>
				</CardFooter>
			</Card>

			<Card className="@container/card">
				<CardHeader>
					<CardDescription>{t("overtime")}</CardDescription>
					<CardTitle className="text-2xl font-semibold text-nowrap tabular-nums @[250px]/card:text-3xl">
						{overtimeHours} h
					</CardTitle>
				</CardHeader>
				<CardFooter className="hidden flex-col items-start gap-1.5 text-sm md:block">
					<div className="text-muted-foreground">{t("overtimeThisMonth")}</div>
				</CardFooter>
			</Card>
		</div>
	)
}
