"use client"

import { useMemo } from "react"
import { isSameDay, isSameMonth } from "date-fns"
import { TrendingUp, TrendingDown } from "lucide-react"

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

function getDailyHoursMap(
	entries: typeof useEntries extends () => { entries: infer T } ? T : never
) {
	const map = new Map<string, number>()
	for (const e of entries) {
		const dayKey = new Date(e.date).toDateString()
		map.set(dayKey, (map.get(dayKey) || 0) + e.hours)
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

		const currentTotal = monthEntries.reduce((sum, e) => sum + e.hours, 0)

		const currentOvertime = monthEntries.reduce(
			(sum, e) => sum + Math.max(0, e.hours - 8),
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
		const text = isPositive ? `In aumento ${field}` : `In calo ${field}`

		return (
			<div className="line-clamp-1 flex gap-2 font-medium">
				{text} <Icon className="size-4" />
			</div>
		)
	}

	return (
		<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Media ore/giorno</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-nowrap">
						{averageHoursPerDay.toFixed(1)} h
					</CardTitle>
					<CardAction>{renderDeltaBadge(deltas.avg)}</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm hidden md:block">
					{renderDeltaLabel(deltas.avg, "dal mese scorso")}
					<div className="text-muted-foreground">
						Basato sugli ultimi {registeredWorkingDays} giorni lavorativi
					</div>
				</CardFooter>
			</Card>

			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Giornate registrate</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-nowrap">
						{registeredWorkingDays}/{totalWorkingDays}
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							{registeredWorkingDays - totalWorkingDays}
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm hidden md:block">
					<div className="line-clamp-1 flex gap-2 font-medium">
						{totalWorkingDays - registeredWorkingDays} giornate da registrare
					</div>
					<div className="text-muted-foreground">
						Giornate registrate nel mese corrente
					</div>
				</CardFooter>
			</Card>

			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Ore totali</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-nowrap">
						{totalHours} h
					</CardTitle>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm hidden md:block">
					<div className="text-muted-foreground">
						Totale ore nel mese corrente
					</div>
				</CardFooter>
			</Card>

			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Straordinari</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-nowrap">
						{overtimeHours} h
					</CardTitle>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm hidden md:block">
					<div className="text-muted-foreground">
						Straordinari nel mese corrente
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}
