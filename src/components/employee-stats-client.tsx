"use client"

import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import { format } from "date-fns"
import { Mail } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import type { EntryWithClient, Employee } from "@/types"
import { useEnumOptions } from "@/hooks/use-enum-options"
import { Badge } from "@/components/ui/badge"

interface EmployeeStatsClientProps {
	entries: EntryWithClient[]
	employee: Employee
}

export function EmployeeStatsClient({
	entries,
	employee,
}: EmployeeStatsClientProps) {
	const t = useTranslations("EmployeeDetail")
	const now = useMemo(() => new Date(), [])
	const { roleOptions } = useEnumOptions()
	const [selectedYear, setSelectedYear] = useState(now.getFullYear())
	const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)

	const filteredEntries = useMemo(() => {
		return entries.filter((e) => {
			const d = new Date(e.date)
			return (
				d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth
			)
		})
	}, [entries, selectedYear, selectedMonth])

	const roleLabel = useMemo(() => {
		return (
			roleOptions.find((option) => option.value === employee.role)?.label || ""
		)
	}, [employee.role, roleOptions])

	const stats = useMemo(
		() => ({
			WORK: filteredEntries
				.filter((e) => e.type === "WORK")
				.reduce((acc, e) => acc + e.hours, 0),
			HOLIDAY: filteredEntries
				.filter((e) => e.type === "HOLIDAY")
				.reduce((acc, e) => acc + e.hours, 0),
			PERMIT: filteredEntries
				.filter((e) => e.type === "PERMIT")
				.reduce((acc, e) => acc + e.hours, 0),
			SICK: filteredEntries
				.filter((e) => e.type === "SICK")
				.reduce((acc, e) => acc + e.hours, 0),
			// Nuove statistiche
			TOTAL: filteredEntries.reduce((acc, e) => acc + e.hours, 0),
			OVERTIME: filteredEntries.reduce(
				(acc, e) => acc + (e.overtimeHours || 0),
				0
			),
			DAYS_WORKED: new Set(
				filteredEntries
					.filter((e) => e.type === "WORK")
					.map((e) => {
						const d = new Date(e.date)
						return d.toISOString().split("T")[0]
					})
			).size,
			CLIENTS: new Set(filteredEntries.map((e) => e.clientId)).size,
		}),
		[filteredEntries]
	)

	const years = useMemo(() => {
		const allYears = Array.from(
			new Set(entries.map((e) => new Date(e.date).getFullYear()))
		)
		if (allYears.length === 0) return [now.getFullYear()]
		return allYears.sort((a, b) => b - a)
	}, [entries, now])

	return (
		<div className="mx-auto flex h-full w-full max-w-2xl flex-col gap-4 p-4">
			<div className="from-primary/80 to-primary/40 text-primary-foreground dark:from-primary/80 dark:to-primary/40 dark:text-foreground flex flex-1 flex-col items-center justify-center rounded-xl bg-gradient-to-br p-6 shadow-lg">
				<div className="mb-2 flex items-center gap-4">
					<span className="text-3xl font-bold">
						{employee.firstName} {employee.lastName}
					</span>
					<Badge variant="secondary" className="bg-secondary/50">
						{roleLabel}
					</Badge>
				</div>
				<div className="flex flex-wrap justify-center gap-4 text-sm font-medium opacity-90">
					<a href={`mailto://${employee.email}`} className="font-mono">
						<div className="flex items-center gap-2">
							<Mail className="size-4" />
							{employee.email}
						</div>
					</a>
				</div>
			</div>

			<div className="bg-muted/60 border-muted-foreground/10 flex w-full items-center gap-4 rounded-lg border p-4 shadow-sm">
				<div className="flex flex-col gap-2">
					<div className="flex gap-2">
						<Select
							value={String(selectedMonth)}
							onValueChange={(v) => setSelectedMonth(Number(v))}
						>
							<SelectTrigger className="border-muted-foreground/30 bg-background/90 h-10 w-32 rounded-md border px-3 text-base font-semibold shadow">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
									<SelectItem key={month} value={String(month)}>
										{format(new Date(2000, month - 1, 1), "MMMM")}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							value={String(selectedYear)}
							onValueChange={(v) => setSelectedYear(Number(v))}
						>
							<SelectTrigger className="border-muted-foreground/30 bg-background/90 h-10 w-24 rounded-md border px-3 text-base font-semibold shadow">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{years.map((year) => (
									<SelectItem key={year} value={String(year)}>
										{year}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>{t("totalHours")}</CardTitle>
					</CardHeader>
					<CardContent>
						<span className="text-2xl font-bold">{stats.TOTAL} h</span>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>{t("overtime")}</CardTitle>
					</CardHeader>
					<CardContent>
						<span className="text-2xl font-bold">{stats.OVERTIME} h</span>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>{t("daysWorked")}</CardTitle>
					</CardHeader>
					<CardContent>
						<span className="text-2xl font-bold">{stats.DAYS_WORKED}</span>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>{t("uniqueClients")}</CardTitle>
					</CardHeader>
					<CardContent>
						<span className="text-2xl font-bold">{stats.CLIENTS}</span>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>{t("work")}</CardTitle>
					</CardHeader>
					<CardContent>
						<span className="text-2xl font-bold">{stats.WORK} h</span>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>{t("holiday")}</CardTitle>
					</CardHeader>
					<CardContent>
						<span className="text-2xl font-bold">{stats.HOLIDAY} h</span>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>{t("permit")}</CardTitle>
					</CardHeader>
					<CardContent>
						<span className="text-2xl font-bold">{stats.PERMIT} h</span>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>{t("sick")}</CardTitle>
					</CardHeader>
					<CardContent>
						<span className="text-2xl font-bold">{stats.SICK} h</span>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
