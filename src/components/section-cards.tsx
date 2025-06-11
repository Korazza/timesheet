"use client"

import { useMemo } from "react"
import { isSameDay, isSameMonth } from "date-fns"
import { TrendingUp } from "lucide-react"

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
import { getItalianHolidays } from "@/lib/holidays"

export function SectionCards() {
	const { entries } = useEntries()

	const {
		averageHoursPerDay,
		registeredWorkingDays,
		totalWorkingDays,
		totalHours,
		overtimeHours,
	} = useMemo(() => {
		const now = new Date()
		const year = now.getFullYear()
		const month = now.getMonth()
		const today = now.getDate()
		const holidays = getItalianHolidays(now.getFullYear())
		const monthEntries = entries.filter(
			(e) => e.type === "WORK" && isSameMonth(new Date(e.date), now)
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

		const dailyHoursMap = new Map<string, number>()

		for (const e of monthEntries) {
			const dayKey = new Date(e.date).toDateString()
			dailyHoursMap.set(dayKey, (dailyHoursMap.get(dayKey) || 0) + e.hours)
		}

		const avg = dailyHoursMap.size
			? Array.from(dailyHoursMap.values()).reduce(
					(sum, hours) => sum + hours,
					0
			  ) / dailyHoursMap.size
			: 0

		return {
			averageHoursPerDay: avg,
			registeredWorkingDays: registeredDays.size,
			totalWorkingDays: allDays.length,
			totalHours: monthEntries.reduce((sum, e) => sum + e.hours, 0),
			overtimeHours: monthEntries.reduce(
				(sum, e) => sum + Math.max(0, e.hours - 8),
				0
			),
		}
	}, [entries])

	return (
		<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Media ore/giorno</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-nowrap">
						{averageHoursPerDay} h
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<TrendingUp />
							+1.0%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm hidden md:block">
					<div className="line-clamp-1 flex gap-2 font-medium">
						In aumento dal mese scorso <TrendingUp className="size-4" />
					</div>
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
					<CardAction>
						<Badge variant="outline">
							<TrendingUp />
							+5.2%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm hidden md:block">
					<div className="line-clamp-1 flex gap-2 font-medium">
						In aumento dal mese scorso <TrendingUp className="size-4" />
					</div>
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
					<CardAction>
						<Badge variant="outline">
							<TrendingUp />
							+2.5%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm hidden md:block">
					<div className="line-clamp-1 flex gap-2 font-medium">
						In aumento in questo mese <TrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">
						Ore oltre il limite giornaliero
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}
