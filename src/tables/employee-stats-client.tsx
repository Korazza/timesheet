// This file has been moved to src/components/employee/employee-stats-client.tsx

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { useMemo, useState } from "react"
import type { EntryWithClient, Employee } from "@/types"
import { useTranslations } from "next-intl"

interface EmployeeStatsClientProps {
	entries: EntryWithClient[]
	employee: Employee
}

export default function EmployeeStatsClient({
	entries,
	employee,
}: EmployeeStatsClientProps) {
	const t = useTranslations("EmployeeDetail")
	const now = new Date()
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
		}),
		[filteredEntries]
	)

	const years = useMemo(() => {
		const allYears = Array.from(
			new Set(entries.map((e) => new Date(e.date).getFullYear()))
		)
		return allYears.sort((a, b) => b - a)
	}, [entries])

	return (
		<div className="mx-auto w-full max-w-2xl p-4">
			{/* Employee Info Hero */}
			<div className="from-primary/80 to-primary/40 mb-8 flex flex-col items-center rounded-xl bg-gradient-to-r p-6 text-white shadow-lg">
				<div className="mb-2 flex items-center gap-3">
					<span className="text-3xl font-bold">
						{employee.firstName} {employee.lastName}
					</span>
					<span className="rounded bg-white/20 px-2 py-1 text-xs font-semibold tracking-wide uppercase">
						{employee.role}
					</span>
				</div>
				<div className="flex flex-wrap justify-center gap-4 text-sm font-medium opacity-90">
					<div>
						{t("email")}: <span className="font-mono">{employee.email}</span>
					</div>
				</div>
			</div>

			<h1 className="mb-6 text-2xl font-bold">
				{t("statsTitle", {
					name: `${employee.firstName} ${employee.lastName}`,
				})}
			</h1>
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>{t("selectPeriod")}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex gap-2">
						<Select
							value={String(selectedYear)}
							onValueChange={(v) => setSelectedYear(Number(v))}
						>
							<SelectTrigger className="w-24">
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
						<Select
							value={String(selectedMonth)}
							onValueChange={(v) => setSelectedMonth(Number(v))}
						>
							<SelectTrigger className="w-32">
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
					</div>
				</CardContent>
			</Card>
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
