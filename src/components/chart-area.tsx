"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useEntries } from "@/hooks/use-entries"
import { eachDayOfInterval, isSameDay, isWeekend } from "date-fns"
import { getHolidaySet, subWorkingDays } from "@/lib/calendar"

type TimeRange = "90d" | "30d" | "7d"

const getChartColor = (index: number) => {
	const colorIndex = (index % 5) + 1
	return `var(--chart-${colorIndex})`
}

export function ChartArea() {
	const { workingEntries } = useEntries()
	const isMobile = useIsMobile()
	const [defaultTimeRange, setDefaultTimeRange] =
		React.useState<TimeRange>("30d")
	const [timeRange, setTimeRange] = React.useState<TimeRange>(defaultTimeRange)

	React.useEffect(() => {
		if (isMobile) {
			setTimeRange("7d")
			setDefaultTimeRange("7d")
		}
	}, [isMobile])

	const { chartClients, chartConfig, chartData } = React.useMemo(() => {
		const now = new Date()
		const fromDate = {
			"90d": subWorkingDays(now, 90),
			"30d": subWorkingDays(now, 30),
			"7d": subWorkingDays(now, 7),
		}[timeRange]

		const workingDays = eachDayOfInterval({ start: fromDate, end: now }).filter(
			(d) =>
				!isWeekend(d) &&
				!getHolidaySet(d.getFullYear()).has(d.toISOString().slice(0, 10))
		)

		const workingDaySet = new Set(
			workingDays.map((d) => d.toISOString().slice(0, 10))
		)

		const filteredEntries = workingEntries.filter((entry) =>
			workingDaySet.has(new Date(entry.date).toISOString().slice(0, 10))
		)

		const clientMap = new Map()
		for (const entry of filteredEntries) {
			if (entry.client && !clientMap.has(entry.client.id)) {
				clientMap.set(entry.client.id, entry.client)
			}
		}
		const _chartClients = Array.from(clientMap.values())

		const _chartConfig: ChartConfig = {
			hours: { label: "Ore" },
		}
		for (const [index, client] of Object.entries(_chartClients)) {
			if (!client) continue
			_chartConfig[client.id] = {
				label: client.name,
				color: getChartColor(Number(index)),
			}
		}

		const _chartData = workingDays.map((day) => {
			const isoDate = day.toISOString().slice(0, 10)
			const dailyEntries = filteredEntries.filter(
				(entry) => new Date(entry.date).toISOString().slice(0, 10) === isoDate
			)

			const dataPoint: any = { date: day.toISOString() }

			for (const client of _chartClients) {
				if (!client) continue
				const totalHours = dailyEntries
					.filter((e) => e.clientId === client.id)
					.reduce((sum, e) => sum + e.hours + (e.overtimeHours ?? 0), 0)
				dataPoint[client.id] = totalHours
			}

			return dataPoint
		})

		return {
			chartClients: _chartClients,
			chartConfig: _chartConfig,
			chartData: _chartData,
		}
	}, [workingEntries, timeRange])

	return (
		<Card className="@container/card h-[500px] md:h-full md:flex-1">
			<CardHeader>
				<CardTitle>Ore per cliente</CardTitle>
				<CardDescription>
					<span className="hidden @[540px]/card:block">
						Totale per gli ultimi{" "}
						{
							{
								"90d": "3 mesi",
								"30d": "30 giorni",
								"7d": "7 giorni",
							}[timeRange]
						}
					</span>
				</CardDescription>
				<CardAction>
					<ToggleGroup
						type="single"
						value={timeRange}
						onValueChange={(selectedTimeRange) => {
							setTimeRange(
								selectedTimeRange
									? (selectedTimeRange as TimeRange)
									: defaultTimeRange
							)
						}}
						variant="outline"
						className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
					>
						<ToggleGroupItem value={"90d" as TimeRange}>
							Ultimi 3 mesi
						</ToggleGroupItem>
						<ToggleGroupItem value={"30d" as TimeRange}>
							Ultimi 30 giorni
						</ToggleGroupItem>
						<ToggleGroupItem value={"7d" as TimeRange}>
							Ultimi 7 giorni
						</ToggleGroupItem>
					</ToggleGroup>
					<Select
						value={timeRange}
						onValueChange={(selectedTimeRange) => {
							setTimeRange(
								selectedTimeRange
									? (selectedTimeRange as TimeRange)
									: defaultTimeRange
							)
						}}
					>
						<SelectTrigger
							className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
							size="sm"
							aria-label="Select a value"
						>
							<SelectValue placeholder="Ultimi 3 mesi" />
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							<SelectItem value={"90d" as TimeRange} className="rounded-lg">
								Ultimi 3 mesi
							</SelectItem>
							<SelectItem value={"30d" as TimeRange} className="rounded-lg">
								Ultimi 30 giorni
							</SelectItem>
							<SelectItem value={"7d" as TimeRange} className="rounded-lg">
								Ultimi 7 giorni
							</SelectItem>
						</SelectContent>
					</Select>
				</CardAction>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 h-full items-end flex">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-full w-full"
				>
					<AreaChart data={chartData}>
						<defs>
							{chartClients.map((client) => (
								<linearGradient
									key={client.id}
									id={`fill-${client.id}`}
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor={chartConfig[client.id].color}
										stopOpacity={1.0}
									/>
									<stop
										offset="95%"
										stopColor={chartConfig[client.id].color}
										stopOpacity={0.1}
									/>
								</linearGradient>
							))}
						</defs>
						<CartesianGrid vertical={false} />
						<YAxis
							domain={[1, 8]}
							tickMargin={8}
							tickFormatter={(value) => `${value} h`}
						/>
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value)
								return date.toLocaleDateString("it-IT", {
									month: "short",
									day: "numeric",
								})
							}}
						/>
						<ChartTooltip
							cursor={false}
							defaultIndex={isMobile ? -1 : 10}
							content={
								<ChartTooltipContent
									labelFormatter={(value) => {
										return new Date(value).toLocaleDateString("it-IT", {
											month: "short",
											day: "numeric",
										})
									}}
									/* 									formatter={(value, name, item) =>
										Number(value) > 0 ? (
											<div className="flex gap-2 items-center">
												<span
													className="w-2.5 h-2.5 rounded-full"
													style={{ backgroundColor: item.color }}
												/>
												<span className="font-semibold">
													{chartClients.find((c) => c.id === name).name}:
												</span>
												<span>{`${value} h`}</span>
											</div>
										) : undefined
									} */
								/>
							}
						/>
						{chartClients.map((client) => (
							<Area
								key={client.id}
								dataKey={client.id}
								type="step"
								fill={`url(#fill-${client.id})`}
								stroke={chartConfig[client.id].color}
								stackId="a"
							/>
						))}
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
