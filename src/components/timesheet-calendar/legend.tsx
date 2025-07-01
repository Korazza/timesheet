"use client"

import { useTranslations } from "next-intl"

export function TimesheetLegend() {
	const t = useTranslations("Calendar")
	const legendItems = [
		{
			label: t("activity"),
			color: "var(--working-entry)",
		},
		{
			label: t("holiday"),
			color: "var(--holiday-entry)",
		},
		{
			label: t("permit"),
			color: "var(--permit-entry)",
		},
		{
			label: t("sick"),
			color: "var(--sick-entry)",
		},
	]

	return (
		<div className="bg-muted/50 flex flex-wrap justify-center gap-2.5 border-t px-4 py-2 md:w-full md:gap-4 lg:gap-8 xl:gap-10">
			{legendItems.map((item) => (
				<div
					key={item.label}
					className="flex items-center gap-1 text-xs md:gap-2 md:text-sm"
				>
					<span
						className="h-4 w-4 rounded shadow"
						style={{ backgroundColor: item.color }}
					/>
					<span className="text-card-foreground">{item.label}</span>
				</div>
			))}
		</div>
	)
}
